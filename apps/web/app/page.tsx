import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            북마크 서비스
          </Link>
          <div className="space-x-4">
            <Link
              href="/auth/signin"
              className="text-gray-600 hover:text-gray-900"
            >
              로그인
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              회원가입
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            모든 북마크를 한곳에서 관리하세요
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            간편하고 효율적인 북마크 관리 서비스를 경험해보세요
          </p>
          <Link
            href="/dashboard"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "간편한 저장",
                description: "원클릭으로 웹페이지를 저장하세요",
              },
              {
                title: "스마트 정리",
                description: "태그와 폴더로 체계적인 관리가 가능합니다",
              },
              {
                title: "어디서나 접근",
                description: "모든 기기에서 북마크에 접근하세요",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
