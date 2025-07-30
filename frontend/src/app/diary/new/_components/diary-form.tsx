import { LinkButton } from "@/components/ui/link-button";
import { FiSave, FiLoader } from "react-icons/fi";

interface DiaryFormProps {
  title: string;
  content: string;
  loading: boolean;
  error: string | null;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DiaryForm({
  title,
  content,
  loading,
  error,
  onTitleChange,
  onContentChange,
  onSubmit,
}: DiaryFormProps) {
  const isDisabled = loading || !title.trim() || !content.trim();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">新しい日記を書く</h1>
      </div>

      <form onSubmit={onSubmit} className="px-6 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="日記のタイトルを入力してください"
            maxLength={200}
            required
          />
          <p className="mt-1 text-sm text-gray-500">{title.length}/200文字</p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            placeholder="今日はどんな一日でしたか？"
            required
          />
          <p className="mt-1 text-sm text-gray-500">{content.length}文字</p>
        </div>

        <div className="flex justify-end space-x-4">
          <LinkButton href="/" variant="secondary">
            キャンセル
          </LinkButton>
          <button
            type="submit"
            disabled={isDisabled}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                保存中...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                保存する
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
