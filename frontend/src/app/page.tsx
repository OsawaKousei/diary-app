"use client";

import { useState, useEffect } from "react";
import { DiariesListResponse } from "@/types/diary";
import { Header } from "./_components/header";
import { HeroSection } from "./_components/hero-section";
import { StatsGrid } from "./_components/stats-grid";
import { DiaryList } from "./_components/diary-list";

export default function Home() {
  const [diaries, setDiaries] = useState<DiariesListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/diary");
      if (!response.ok) {
        throw new Error("日記の取得に失敗しました");
      }
      const data: DiariesListResponse = await response.json();
      setDiaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        <StatsGrid diaries={diaries} />
        <DiaryList
          diaries={diaries}
          loading={loading}
          error={error}
          onRetry={fetchDiaries}
        />
      </main>
    </div>
  );
}
