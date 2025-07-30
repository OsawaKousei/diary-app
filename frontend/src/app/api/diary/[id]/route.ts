import { NextRequest, NextResponse } from "next/server";
import { DiaryResponse } from "@/types/diary";
import logger from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diaryId = params.id;

    // パラメータの検証
    if (!diaryId || isNaN(Number(diaryId))) {
      logger.error(`無効な日記ID: ${diaryId}`);
      return NextResponse.json(
        { error: "有効な日記IDが必要です" },
        { status: 400 }
      );
    }

    // 環境変数からBACKEND_URLを取得
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      logger.error("バックエンドURLが設定されていません");
      return NextResponse.json(
        { error: "バックエンドURLが設定されていません" },
        { status: 500 }
      );
    }

    // バックエンドの/diary/{id}エンドポイントにリクエストを送信
    const response = await fetch(`${backendUrl}/diary/${diaryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error(
        `バックエンドからのレスポンスがエラー: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: errorData.detail || `バックエンドエラー: ${response.status}` },
        { status: response.status }
      );
    }

    const backendResponse: DiaryResponse = await response.json();

    return NextResponse.json(backendResponse);
  } catch (error) {
    logger.error(`日記詳細取得中にエラーが発生しました: ${error}`);
    return NextResponse.json(
      { error: "内部サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
