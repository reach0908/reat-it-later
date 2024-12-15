"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface ArticleScript {
  id: number;
  title: string;
  channelName: string;
  videoId: string;
  thumbnailUrl: string;
  extractedAt: string;
  language: string;
  isReviewed: boolean;
  isPublic: boolean;
  content: string;
  transcripts: Array<{
    timestamp: string;
    text: string;
    isHighlighted?: boolean;
  }>;
  likes: number;
  comments: Comment[];
}

export default function ArticlePage() {
  const { videoId } = useParams();
  const [article, setArticle] = useState<ArticleScript>({
    id: 1,
    title: "Next.js 완벽 가이드",
    channelName: "코딩 채널",
    videoId: "abc123",
    thumbnailUrl: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
    extractedAt: "2024-03-20",
    language: "ko",
    isReviewed: false,
    isPublic: true,
    content: "",
    transcripts: [
      { timestamp: "0:00", text: "안녕하세요", isHighlighted: false },
      {
        timestamp: "0:05",
        text: "오늘은 Next.js에 대해 알아보겠습니다",
        isHighlighted: true,
      },
    ],
    likes: 42,
    comments: [
      {
        id: 1,
        author: "사용자1",
        content: "좋은 내용이네요!",
        createdAt: "2024-03-21",
      },
    ],
  });
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {article.title}
        </h1>
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-4">
            <span>{article.channelName}</span>
            <span>추출일: {article.extractedAt}</span>
            {!article.isReviewed && (
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                미검토
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1">
              <span>❤️</span>
              <span>{article.likes}</span>
            </button>
            {article.isPublic ? (
              <span className="text-green-600">공개</span>
            ) : (
              <span className="text-gray-600">비공개</span>
            )}
          </div>
        </div>
      </div>

      {/* 유튜브 임베드 */}
      <div className="aspect-video mb-8">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* 스크립트 & 내용 섹션 */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* 스크립트 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">스크립트</h2>
          <div className="space-y-2">
            {article.transcripts
              .filter((t) => !article.isReviewed || t.isHighlighted)
              .map((transcript, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    transcript.isHighlighted
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-white"
                  }`}
                >
                  <span className="text-gray-500 mr-2">
                    {transcript.timestamp}
                  </span>
                  <span>{transcript.text}</span>
                  {!article.isReviewed && (
                    <button
                      className="ml-2 text-sm text-blue-500 hover:text-blue-600"
                      onClick={() => {
                        const newTranscripts = [...article.transcripts];
                        if (newTranscripts[index]) {
                          newTranscripts[index].isHighlighted =
                            !newTranscripts[index].isHighlighted;
                          setArticle({
                            ...article,
                            transcripts: newTranscripts,
                          });
                        }
                      }}
                    >
                      {transcript.isHighlighted
                        ? "하이라이트 제거"
                        : "하이라이트"}
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* 마크다운 에디터 & 프리뷰 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">내 생각</h2>
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                className="w-full h-64 p-4 border rounded-lg"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="마크다운으로 작성해보세요..."
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => {
                    setArticle({ ...article, content });
                    setIsEditing(false);
                  }}
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div>
              {article.content ? (
                <div className="prose">
                  <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
              ) : (
                <button
                  className="w-full p-4 border-2 border-dashed rounded-lg text-gray-500 hover:text-gray-700"
                  onClick={() => setIsEditing(true)}
                >
                  클릭하여 내용을 작성해보세요
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 댓글 섹션 */}
      {article.isPublic && (
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">댓글</h2>
          <div className="space-y-4">
            {article.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-sm text-gray-500">
                    {comment.createdAt}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg"
                placeholder="댓글을 작성해주세요"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                작성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
