// 확장 프로그램 설치/업데이트 시 초기화
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated");

  // 기본 설정 초기화
  chrome.storage.local.set({
    lastExtractedScript: null,
    settings: {
      autoExtract: false,
      language: "auto",
    },
  });
});

// content script 실행 상태 추적
const executingTabs = new Set();

// content script 실행 함수
async function executeContentScript(tabId) {
  try {
    if (executingTabs.has(tabId)) {
      throw new Error("Script extraction already in progress");
    }

    executingTabs.add(tabId);

    // content script가 이미 주입되어 있는지 확인
    try {
      await chrome.tabs.sendMessage(tabId, { action: "ping" });
    } catch {
      // content script가 없으면 주입
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"],
      });
      // 스크립트 로드를 위한 짧은 대기
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, { action: "extractScript" }, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });

    return response;
  } catch (error) {
    console.error("Script execution failed:", error);
    return { error: error.message };
  } finally {
    executingTabs.delete(tabId);
  }
}

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractScript") {
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
      if (!tab) {
        sendResponse({ error: "No active tab found" });
        return;
      }

      if (!tab.url?.includes("youtube.com/watch")) {
        sendResponse({ error: "Not a YouTube video page" });
        return;
      }

      const response = await executeContentScript(tab.id);
      sendResponse(response);
    });

    return true; // 비동기 응답을 위해 true 반환
  }
});
