"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DiaryCreateRequest } from "@/types/diary";
import { Header } from "./_components/header";
import { DiaryForm } from "./_components/diary-form";

export default function NewDiaryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("タイトルと内容を入力してください");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        } as DiaryCreateRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "日記の作成に失敗しました");
      }

      const diary = await response.json();
      router.push(`/diary/${diary.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiaryForm
          title={title}
          content={content}
          loading={loading}
          error={error}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
