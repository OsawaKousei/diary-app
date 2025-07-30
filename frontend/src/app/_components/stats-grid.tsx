import { DiariesListResponse } from "@/types/diary";
import { FiBook, FiCalendar, FiClock } from "react-icons/fi";

interface StatsGridProps {
  diaries: DiariesListResponse | null;
}

export function StatsGrid({ diaries }: StatsGridProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const thisMonthCount =
    diaries?.diaries.filter((d) => {
      const diaryDate = new Date(d.created_at);
      const now = new Date();
      return (
        diaryDate.getMonth() === now.getMonth() &&
        diaryDate.getFullYear() === now.getFullYear()
      );
    }).length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
            <FiBook className="text-blue-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">総日記数</p>
            <p className="text-2xl font-bold text-gray-900">
              {diaries?.total_count || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
            <FiCalendar className="text-green-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">今月の記録</p>
            <p className="text-2xl font-bold text-gray-900">{thisMonthCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
            <FiClock className="text-purple-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">最新の記録</p>
            <p className="text-sm font-bold text-gray-900">
              {diaries?.diaries[0]
                ? formatDate(diaries.diaries[0].created_at)
                : "まだありません"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
