"use client";

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 바 */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-gray-900">
                  YouScript 대시보드
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signout"
                className="text-gray-600 hover:text-gray-900"
              >
                로그아웃
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 사이드바와 메인 콘텐츠 레이아웃 */}
      <div className="flex">
        {/* 사이드바 */}
        <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
            >
              전체 스크립트
            </Link>
            <Link
              href="/dashboard/favorites"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
            >
              즐겨찾기
            </Link>
            <Link
              href="/dashboard/channels"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
            >
              채널별 보기
            </Link>
            <Link
              href="/dashboard/settings"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
            >
              설정
            </Link>
          </nav>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
