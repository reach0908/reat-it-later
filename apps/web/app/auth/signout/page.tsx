"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // TODO: 실제 로그아웃 로직 구현
    console.log("로그아웃 처리 중...");

    // 로그아웃 후 홈페이지로 리다이렉트
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }, [router]);

  return (
    <>
      <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
        로그아웃
      </h2>
      <p className="mt-4 text-center text-gray-600">
        로그아웃 처리 중입니다...
      </p>
    </>
  );
}
