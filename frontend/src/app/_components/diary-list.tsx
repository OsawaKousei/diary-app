import { DiariesListResponse } from "@/types/diary";
import { LinkButton } from "@/components/ui/link-button";
import { FiPlus, FiBook } from "react-icons/fi";
import { DiaryItem } from "./diary-item";

interface DiaryListProps {
  diaries: DiariesListResponse | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function DiaryList({
  diaries,
  loading,
  error,
  onRetry,
}: DiaryListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">最近の日記</h2>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={onRetry}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            再試行
          </button>
        </div>
      ) : diaries?.diaries.length === 0 ? (
        <div className="p-8 text-center">
          <FiBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            まだ日記がありません
          </h3>
          <p className="text-gray-500 mb-4">
            最初の日記を書いて、あなたの物語を始めましょう
          </p>
          <LinkButton href="/diary/new" variant="primary">
            <FiPlus className="mr-2" />
            新しい日記を書く
          </LinkButton>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {diaries?.diaries.map((diary) => (
            <DiaryItem
              key={diary.id}
              id={diary.id}
              title={diary.title}
              content={diary.content}
              createdAt={diary.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
