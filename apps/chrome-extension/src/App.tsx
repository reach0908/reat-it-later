import { useState, useEffect } from "react";
import "./App.css";

interface ExtractResponse {
  error?: string;
  script?: {
    title: string;
    channelName: string;
    videoId: string;
    transcripts: Array<{
      timestamp: string;
      text: string;
    }>;
    extractedAt: string;
    language: string;
  };
}

function App() {
  const [status, setStatus] = useState("페이지를 확인하는 중...");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isYouTubePage, setIsYouTubePage] = useState(false);
  const [extractedScript, setExtractedScript] = useState<
    ExtractResponse["script"] | null
  >(null);

  useEffect(() => {
    void checkCurrentPage();
  }, []);

  const checkCurrentPage = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.url) {
        setStatus("페이지를 찾을 수 없습니다.");
        return;
      }

      const url = new URL(tab.url);
      if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
        const videoId = url.searchParams.get("v");
        if (videoId) {
          setStatus("유튜브 영상이 감지되었습니다.");
          setIsYouTubePage(true);
          return;
        }
      }

      setStatus("유튜브 영상 페이지가 아닙니다.");
    } catch (error) {
      setStatus("오류가 발생했습니다.");
      setError(error instanceof Error ? error.message : "알 수 없는 오류");
    }
  };

  const extractScript = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setExtractedScript(null);
      setStatus("스크립트를 추출하는 중입니다...");

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        throw new Error("탭을 찾을 수 없습니다.");
      }

      const response: ExtractResponse = await new Promise((resolve) => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "extractScript" },
          (response: ExtractResponse) => {
            if (chrome.runtime.lastError) {
              resolve({ error: chrome.runtime.lastError.message });
            } else {
              resolve(response);
            }
          }
        );
      });

      if (response.error) {
        setStatus("스크립트 추출 실패");
        setError(response.error);
      } else if (response.script) {
        setStatus("스크립트 추출 완료!");
        setExtractedScript(response.script);

        console.group("추출된 스크립트 정보");
        console.log("제목:", response.script.title);
        console.log("채널:", response.script.channelName);
        console.log("비디오 ID:", response.script.videoId);
        console.log("언어:", response.script.language);
        console.log("추출 시간:", response.script.extractedAt);
        console.log("\n=== 스크립트 내용 ===");
        response.script.transcripts.forEach((item) => {
          console.log(`${item.timestamp}: ${item.text}`);
        });
        console.groupEnd();
      }
    } catch (error) {
      setStatus("오류가 발생했습니다.");
      setError(error instanceof Error ? error.message : "알 수 없는 오류");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          YouScript
        </h1>
      </div>

      <div className="p-3 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        {status}
      </div>

      <button
        className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 min-h-[36px] 
          ${
            isLoading || !isYouTubePage
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        onClick={() => void extractScript()}
        disabled={!isYouTubePage || isLoading}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white border-b-transparent rounded-full animate-spin" />
        )}
        <span>{isLoading ? "스크립트 추출 중..." : "스크립트 추출하기"}</span>
      </button>

      {error && (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {extractedScript && (
        <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 max-h-[400px] overflow-y-auto">
          <h2 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {extractedScript.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {extractedScript.channelName}
          </p>
          <div className="flex flex-col gap-2">
            {extractedScript.transcripts.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 text-sm p-1 rounded bg-white dark:bg-gray-800"
              >
                <span className="text-gray-500 dark:text-gray-400 min-w-[60px]">
                  {item.timestamp}
                </span>
                <span className="flex-1 text-gray-900 dark:text-gray-100">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
