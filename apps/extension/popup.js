// DOM 요소
const statusElement = document.getElementById("status");
const extractButton = document.getElementById("extractButton");
const buttonText = document.getElementById("buttonText");
const errorElement = document.getElementById("error");

// 현재 탭이 유튜브 영상 페이지인지 확인
async function checkCurrentPage() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.url) {
      updateStatus("페이지를 찾을 수 없습니다.", true);
      return;
    }

    const url = new URL(tab.url);
    if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
      const videoId = url.searchParams.get("v");
      if (videoId) {
        updateStatus("유튜브 영상이 감지되었습니다.", false);
        extractButton.disabled = false;
        return;
      }
    }

    updateStatus("유튜브 영상 페이지가 아닙니다.", true);
  } catch (error) {
    updateStatus("오류가 발생했습니다.", true);
    showError(error.message);
  }
}

// 버튼 로딩 상태 설정
function setButtonLoading(isLoading) {
  if (isLoading) {
    extractButton.classList.add("loading");
    buttonText.textContent = "스크립트 추출 중...";
    extractButton.disabled = true;
  } else {
    extractButton.classList.remove("loading");
    buttonText.textContent = "스크립트 추출하기";
    extractButton.disabled = false;
  }
}

// 상태 업데이트
function updateStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.style.backgroundColor = isError ? "#fee2e2" : "#f3f4f6";
  errorElement.style.display = "none";
}

// 에러 표시
function showError(message) {
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

// 스크립트 추출
async function extractScript() {
  try {
    setButtonLoading(true);
    updateStatus("스크립트를 추출하는 중입니다...");

    // content script에 직접 메시지 전송
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { action: "extractScript" }, (response) => {
      if (chrome.runtime.lastError) {
        setButtonLoading(false);
        showError("스크립트 추출 중 오류가 발생했습니다.");
        console.error(chrome.runtime.lastError);
        return;
      }

      if (response && response.error) {
        setButtonLoading(false);
        updateStatus("스크립트 추출 실패", true);
        showError(response.error);
      } else if (response && response.script) {
        setButtonLoading(false);
        updateStatus("스크립트 추출 완료!");
        console.log("추출된 스크립트:", response.script);
      }
    });
  } catch (error) {
    setButtonLoading(false);
    updateStatus("오류가 발생했습니다.", true);
    showError(error.message);
  }
}

// 이벤트 리스너
extractButton.addEventListener("click", extractScript);

// 초기화
document.addEventListener("DOMContentLoaded", checkCurrentPage);
