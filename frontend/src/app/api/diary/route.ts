import { NextRequest, NextResponse } from "next/server";
import {
  DiaryCreateRequest,
  DiaryResponse,
  DiariesListResponse,
} from "@/types/diary";
import logger from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body: DiaryCreateRequest = await request.json();

    // リクエストの検証
    if (!body.title || typeof body.title !== "string") {
      logger.error(`Invalid request body:${JSON.stringify(body)}`);
      return NextResponse.json(
        { error: "タイトルが必要です" },
        { status: 400 }
      );
    }

    if (!body.content || typeof body.content !== "string") {
      logger.error(`Invalid request body:${JSON.stringify(body)}`);
      return NextResponse.json({ error: "内容が必要です" }, { status: 400 });
    }

    if (body.title.trim().length === 0) {
      logger.error("Empty title provided");
      return NextResponse.json(
        { error: "タイトルが必要です" },
        { status: 400 }
      );
    }

    if (body.content.trim().length === 0) {
      logger.error("Empty content provided");
      return NextResponse.json({ error: "内容が必要です" }, { status: 400 });
    }

    if (body.title.length > 200) {
      logger.error("Title exceeds maximum length of 200 characters");
      return NextResponse.json(
        { error: "タイトルは200文字以内で入力してください" },
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

    // バックエンドの/diaryエンドポイントにリクエストを送信
    const response = await fetch(`${backendUrl}/diary/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: body.title.trim(),
        content: body.content.trim(),
      } as DiaryCreateRequest),
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
    logger.error(`Diary POST API エラー: ${error}`);
    return NextResponse.json(
      { error: "内部サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 環境変数からBACKEND_URLを取得
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      logger.error("バックエンドURLが設定されていません");
      return NextResponse.json(
        { error: "バックエンドURLが設定されていません" },
        { status: 500 }
      );
    }

    // バックエンドの/diaryエンドポイントにリクエストを送信
    const response = await fetch(`${backendUrl}/diary/`, {
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

    const backendResponse: DiariesListResponse = await response.json();

    return NextResponse.json(backendResponse);
  } catch (error) {
    logger.error(`Diary GET API エラー: ${error}`);
    return NextResponse.json(
      { error: "内部サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
