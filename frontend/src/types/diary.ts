/**
 * 日記作成リクエスト
 */
export interface DiaryCreateRequest {
  /** 日記のタイトル (1-200文字) */
  title: string;
  /** 日記の内容 (1文字以上) */
  content: string;
}

/**
 * 日記レスポンス
 */
export interface DiaryResponse {
  /** 日記ID */
  id: number;
  /** 日記のタイトル */
  title: string;
  /** 日記の内容 */
  content: string;
  /** 作成日時 */
  created_at: string;
  /** 更新日時 */
  updated_at: string;
}

/**
 * 日記一覧レスポンス
 */
export interface DiariesListResponse {
  /** 日記一覧 */
  diaries: DiaryResponse[];
  /** 総件数 */
  total_count: number;
}
