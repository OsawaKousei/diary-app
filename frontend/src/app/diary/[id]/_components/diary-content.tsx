import { FiCalendar, FiClock, FiLoader, FiArrowLeft } from "react-icons/fi";
import { DiaryResponse } from "@/types/diary";
import { LinkButton } from "@/components/ui/link-button";

interface DiaryContentProps {
  diary: DiaryResponse | null;
  loading: boolean;
  error: string | null;
}

export function DiaryContent({ diary, loading, error }: DiaryContentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <FiLoader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">日記を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !diary) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {error || "日記が見つかりません"}
            </p>
            <LinkButton href="/" variant="secondary">
              <FiArrowLeft className="mr-2" />
              ホームに戻る
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{diary.title}</h1>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            <span>作成日: {formatDate(diary.created_at)}</span>
          </div>
          {diary.updated_at !== diary.created_at && (
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>更新日: {formatDate(diary.updated_at)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-6">
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {diary.content}
          </p>
        </div>
      </div>
    </div>
  );
}
