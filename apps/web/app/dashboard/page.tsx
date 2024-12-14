"use client";

import { useState } from "react";
import Link from "next/link";

interface Script {
  id: number;
  title: string;
  channelName: string;
  videoId: string;
  thumbnailUrl: string;
  extractedAt: string;
  language: string;
  isReviewed: boolean;
}

export default function DashboardPage() {
  const [scripts, setScripts] = useState<Script[]>([
    {
      id: 1,
      title: "Next.js 완벽 가이드",
      channelName: "코딩 채널",
      videoId: "abc123",
      thumbnailUrl: `https://i.ytimg.com/vi/abc123/hqdefault.jpg`,
      extractedAt: "2024-03-20",
      language: "ko",
      isReviewed: false,
    },
    {
      id: 2,
      title: "리액트 기초 강의",
      channelName: "프로그래밍 튜토리얼",
      videoId: "xyz789",
      thumbnailUrl: `https://i.ytimg.com/vi/xyz789/hqdefault.jpg`,
      extractedAt: "2024-03-19",
      language: "ko",
      isReviewed: true,
    },
  ]);

  const unreviewed = scripts.filter((script) => !script.isReviewed);

  return (
    <div className="space-y-8">
      {/* 미검토 스크립트 섹션 */}
      {unreviewed.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            검토가 필요한 스크립트 ({unreviewed.length})
          </h2>
          <div className="grid gap-3">
            {unreviewed.map((script) => (
              <Link
                href={`/articles/${script.videoId}`}
                key={script.id}
                className="block bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-32 h-20 flex-shrink-0">
                    <img
                      src={script.thumbnailUrl}
                      alt={script.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {script.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {script.channelName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      추출일: {script.extractedAt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 전체 스크립트 목록 섹션 */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">내 스크립트 목록</h1>
        </div>

        <div className="grid gap-4">
          {scripts.map((script) => (
            <Link
              href={`/articles/${script.videoId}`}
              key={script.id}
              className="block"
            >
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="w-40 h-24 flex-shrink-0">
                    <img
                      src={script.thumbnailUrl}
                      alt={script.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-500">
                      {script.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {script.channelName}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                      <span>추출일: {script.extractedAt}</span>
                      <span>
                        언어: {script.language === "ko" ? "한국어" : "영어"}
                      </span>
                      {!script.isReviewed && (
                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                          미검토
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="text-red-400 hover:text-red-600"
                      onClick={(e) => {
                        e.preventDefault();
                        // 삭제 로직 구현
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {scripts.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            저장된 스크립트가 없습니다.
            <br />
            Chrome 확장프로그램을 통해 유튜브 스크립트를 추출해보세요.
          </div>
        )}
      </div>
    </div>
  );
}
