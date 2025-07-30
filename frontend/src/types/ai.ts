/**
 * 日記コメント生成リクエスト
 */
export interface DiaryCommentRequest {
  /** 日記の内容 (1-10000文字) */
  diary_content: string;
}

/**
 * 日記コメント生成レスポンス
 */
export interface DiaryCommentResponse {
  /** AIが生成したコメント */
  comment: string;
}
