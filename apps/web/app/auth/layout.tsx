import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "인증",
  description: "로그인/로그아웃 페이지",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}
