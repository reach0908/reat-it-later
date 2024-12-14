// 상수 정의
const SELECTORS = {
  title: "h1.ytd-video-primary-info-renderer",
  channelName: "ytd-channel-name yt-formatted-string a",
  moreButton: [
    "button.style-scope.ytd-text-inline-expander",
    "button.yt-spec-button-shape-next",
    "button.yt-spec-touch-feedback-shape",
  ].join(", "),
  transcriptButton: [
    "button[aria-label*='스크립트 표시']",
    "button[aria-label*='자막 표시']",
    "button[aria-label*='Show transcript']",
    "ytd-menu-service-item-renderer[aria-label*='스크립트']",
    "ytd-menu-service-item-renderer[aria-label*='자막']",
    "ytd-menu-service-item-renderer[aria-label*='transcript']",
  ].join(", "),
  transcriptPanel: [
    "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-searchable-transcript']",
    "ytd-transcript-search-panel-renderer",
    "ytd-engagement-panel-section-list-renderer#engagement-panel-searchable-transcript",
  ].join(", "),
  transcriptItems: [
    "ytd-transcript-segment-renderer",
    "ytd-transcript-body-renderer div.segment",
  ].join(", "),
  timestamp: [
    "div.segment-timestamp",
    "div.ytd-transcript-segment-renderer span",
  ].join(", "),
  text: [
    "div.segment-text",
    "div.ytd-transcript-segment-renderer yt-formatted-string",
  ].join(", "),
};

const TIMEOUT = 5000; // 5초 타임아웃

// 지정된 시간만큼 대기하는 함수
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 요소가 나타날 때까지 대기하는 함수
async function waitForElement(selector, timeout = TIMEOUT) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;
    await wait(100);
  }

  throw new Error(`Element ${selector} not found within ${timeout}ms`);
}

// 영상 정보 추출 함수
function extractVideoInfo() {
  const title = document.querySelector(SELECTORS.title)?.textContent?.trim();
  const channelName = document
    .querySelector(SELECTORS.channelName)
    ?.textContent?.trim();
  const videoId = new URL(window.location.href).searchParams.get("v");

  if (!title || !channelName || !videoId) {
    throw new Error("Failed to extract video information");
  }

  return { title, channelName, videoId };
}

// 자막 패널 열기 함수
async function openTranscriptPanel() {
  try {
    console.log("Looking for transcript options...");

    // 먼저 더보기 버튼 찾기
    const moreButton = await waitForElement(SELECTORS.moreButton);
    console.log("Found more button:", moreButton);
    moreButton.click();
    await wait(1000);

    // 자막/스크립트 버튼 찾기
    console.log("Looking for transcript button...");
    const transcriptButton = await waitForElement(SELECTORS.transcriptButton);
    console.log("Found transcript button:", transcriptButton);
    transcriptButton.click();
    await wait(1000);

    // 자막 패널이 나타날 때까지 대기
    console.log("Waiting for transcript panel...");
    const panel = await waitForElement(SELECTORS.transcriptPanel);
    if (!panel) {
      throw new Error("Transcript panel not found");
    }
    console.log("Found transcript panel:", panel);

    return panel;
  } catch (error) {
    console.error("Failed to open transcript panel:", error);
    throw error;
  }
}

// 자막 추출 함수
function extractTranscripts(panel) {
  // 자막 세그먼트들이 로드될 때까지 잠시 대기
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        console.log("Looking for transcript segments...");
        const items = panel.querySelectorAll(SELECTORS.transcriptItems);
        console.log("Found transcript items:", items.length);

        if (!items || items.length === 0) {
          throw new Error("No transcript segments found");
        }

        const transcripts = Array.from(items)
          .map((item) => {
            const timestamp =
              item.querySelector(SELECTORS.timestamp)?.textContent?.trim() ||
              "";
            const text =
              item.querySelector(SELECTORS.text)?.textContent?.trim() || "";
            return { timestamp, text };
          })
          .filter((t) => t.timestamp && t.text && t.text.length > 0);

        console.log("Processed transcripts:", transcripts.length);

        if (transcripts.length === 0) {
          throw new Error("No valid transcript content found");
        }

        resolve(transcripts);
      } catch (error) {
        console.error("Failed to extract transcripts:", error);
        reject(error);
      }
    }, 1000);
  });
}

// 메인 스크립트 추출 함수
async function extractYoutubeScript() {
  try {
    console.log("Starting script extraction...");

    // 1. 비디오 정보 추출
    const videoInfo = extractVideoInfo();
    console.log("Video info extracted:", videoInfo);

    // 2. 자막 패널 열기
    const transcriptPanel = await openTranscriptPanel();
    console.log("Transcript panel opened");

    // 3. 자막 추출
    const transcripts = await extractTranscripts(transcriptPanel);
    console.log("Transcripts extracted:", transcripts.length, "segments");

    // 4. 결과 반환
    const result = {
      script: {
        ...videoInfo,
        transcripts,
        extractedAt: new Date().toISOString(),
        language: document.documentElement.lang || "unknown",
      },
    };

    console.log("Successfully extracted script:", result);
    return result;
  } catch (error) {
    console.error("Failed to extract script:", error);
    return {
      error: error.message,
    };
  }
}

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractScript") {
    extractYoutubeScript().then(sendResponse);
    return true; // 비동기 응답을 위해 true 반환
  }
});
