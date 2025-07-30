import { FiMessageCircle, FiLoader } from "react-icons/fi";

interface AiCommentSectionProps {
  aiComment: string | null;
  commentLoading: boolean;
  commentError: string | null;
  onGenerateComment: () => void;
}

export function AiCommentSection({
  aiComment,
  commentLoading,
  commentError,
  onGenerateComment,
}: AiCommentSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiMessageCircle className="mr-2" />
            AIからのコメント
          </h2>
          <button
            onClick={onGenerateComment}
            disabled={commentLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {commentLoading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                生成中...
              </>
            ) : (
              <>
                <FiMessageCircle className="mr-2" />
                コメントを生成
              </>
            )}
          </button>
        </div>
      </div>
      <div className="px-6 py-6">
        {commentError ? (
          <div className="text-red-500 text-center py-4">
            <p>{commentError}</p>
            <button
              onClick={onGenerateComment}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              再試行
            </button>
          </div>
        ) : aiComment ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">
              {aiComment}
            </p>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            <FiMessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>
              「コメントを生成」ボタンを押して、AIからのコメントを取得してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
