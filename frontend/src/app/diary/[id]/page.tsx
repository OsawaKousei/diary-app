"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { DiaryResponse } from "@/types/diary";
import { DiaryCommentResponse } from "@/types/ai";
import { Header } from "./_components/header";
import { DiaryContent } from "./_components/diary-content";
import { AiCommentSection } from "./_components/ai-comment-section";

export default function DiaryDetailPage() {
  const params = useParams();
  const diaryId = params.id as string;

  const [diary, setDiary] = useState<DiaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiComment, setAiComment] = useState<string | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const fetchDiary = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/diary/${diaryId}`);
      if (!response.ok) {
        throw new Error("日記の取得に失敗しました");
      }
      const data: DiaryResponse = await response.json();
      setDiary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [diaryId]);

  useEffect(() => {
    if (diaryId) {
      fetchDiary();
    }
  }, [diaryId, fetchDiary]);

  const generateAiComment = async () => {
    if (!diary) return;

    try {
      setCommentLoading(true);
      setCommentError(null);
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diary_content: diary.content,
        }),
      });

      if (!response.ok) {
        throw new Error("AIコメントの生成に失敗しました");
      }

      const data: DiaryCommentResponse = await response.json();
      setAiComment(data.comment);
    } catch (err) {
      setCommentError(
        err instanceof Error ? err.message : "エラーが発生しました"
      );
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiaryContent diary={diary} loading={loading} error={error} />
        {diary && (
          <AiCommentSection
            aiComment={aiComment}
            commentLoading={commentLoading}
            commentError={commentError}
            onGenerateComment={generateAiComment}
          />
        )}
      </main>
    </div>
  );
}
