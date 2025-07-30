import { LinkButton } from "@/components/ui/link-button";
import { FiCalendar } from "react-icons/fi";

interface DiaryItemProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export function DiaryItem({ id, title, content, createdAt }: DiaryItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncatedContent =
    content.length > 150 ? `${content.substring(0, 150)}...` : content;

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a
              href={`/diary/${id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {title}
            </a>
          </h3>
          <p className="text-gray-600 mb-3 line-clamp-2">{truncatedContent}</p>
          <div className="flex items-center text-sm text-gray-500">
            <FiCalendar className="mr-1" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <LinkButton href={`/diary/${id}`} variant="secondary" size="sm">
            詳細を見る
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
