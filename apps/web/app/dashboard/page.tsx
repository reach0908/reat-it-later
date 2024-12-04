"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      title: "Google",
      url: "https://google.com",
      tags: ["검색", "자주 방문"],
      folder: "즐겨찾기",
    },
    {
      id: 2,
      title: "GitHub",
      url: "https://github.com",
      tags: ["개발", "코드"],
      folder: "개발",
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">내 북마크</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          + 새 북마크 추가
        </button>
      </div>

      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500"
                  >
                    {bookmark.title}
                  </a>
                </h3>
                <p className="text-sm text-gray-500 mt-1">{bookmark.url}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  수정
                </button>
                <button className="text-red-400 hover:text-red-600">
                  삭제
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                폴더: {bookmark.folder}
              </div>
              <div className="flex gap-2">
                {bookmark.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
