import { Button } from "@repo/ui";
import Link from "next/link";

// 북마크된 글 목록을 위한 임시 데이터
const bookmarks = [
  {
    id: 1,
    title: "리액트 훅스 완벽 가이드",
    url: "https://example.com/react-hooks",
  },
  {
    id: 2,
    title: "타입스크립트 시작하기",
    url: "https://example.com/typescript-intro",
  },
  {
    id: 3,
    title: "Next.js 13 새로운 기능",
    url: "https://example.com/nextjs-13-features",
  },
];

export default function Home() {
  return (
    <div className="flex">
      {/* 사이드 내비게이션 */}
      <nav className="w-64 h-screen bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">메뉴</h2>
        <ul>
          <li>
            <Link href="/" className="block py-2">
              홈
            </Link>
          </li>
          <li>
            <Link href="/bookmarks" className="block py-2">
              북마크
            </Link>
          </li>
          <li>
            <Link href="/settings" className="block py-2">
              설정
            </Link>
          </li>
        </ul>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">내 북마크</h1>
        <ul>
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className="mb-4 p-4 border rounded">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {bookmark.title}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
