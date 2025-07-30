import { NextRequest, NextResponse } from "next/server";
import { DiaryCommentRequest, DiaryCommentResponse } from "@/types/ai";
import logger from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body: DiaryCommentRequest = await request.json();

    // リクエストの検証
    if (!body.diary_content || typeof body.diary_content !== "string") {
      logger.error(`Invalid request body:${JSON.stringify(body)}`);
      return NextResponse.json(
        { error: "日記の内容が必要です" },
        { status: 400 }
      );
    }

    if (body.diary_content.trim().length === 0) {
      logger.error("Empty diary content provided");
      return NextResponse.json(
        { error: "日記の内容が必要です" },
        { status: 400 }
      );
    }

    if (body.diary_content.length > 10000) {
      logger.error("Diary content exceeds maximum length of 10000 characters");
      return NextResponse.json(
        { error: "日記の内容は10000文字以内で入力してください" },
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

    // バックエンドの/commentエンドポイントにリクエストを送信
    const response = await fetch(`${backendUrl}/ai/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        diary_content: body.diary_content.trim(),
      } as DiaryCommentRequest),
    });

    if (!response.ok) {
      logger.error(
        `バックエンドからのレスポンスがエラー: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: `バックエンドエラー: ${response.status}` },
        { status: response.status }
      );
    }

    const backendResponse = await response.json();

    console.log("取得したコメントレスポンス:", backendResponse);

    if (backendResponse.comment) {
      return NextResponse.json({
        comment: backendResponse.comment,
      } as DiaryCommentResponse);
    } else {
      logger.error("コメントの生成に失敗しました");
      return NextResponse.json(
        { error: "コメントの生成に失敗しました" },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error(`AIコメント生成中にエラーが発生しました: ${error}`);
    return NextResponse.json(
      { error: "内部サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
