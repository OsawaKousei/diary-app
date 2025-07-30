import logging
import logging.config
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import google.genai as genai
import uvicorn
import yaml
from dotenv import load_dotenv
from fastapi import FastAPI

from src.api.routers.ai import router as ai_router
from src.api.routers.diary import router as diary_router

# 環境変数の読み込み
load_dotenv()
APP_HOST = os.getenv("APP_HOST", "http://localhost")
APP_PORT = int(os.getenv("APP_PORT", 8000))
LOG_LEVEL = os.getenv("LOG_LEVEL", "info").lower()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ログの設定
with open("logging_config.yaml", "r") as f:
    config = yaml.safe_load(f)
    logging.config.dictConfig(config)

# ロガーを取得
logger = logging.getLogger("app")  # ロガーを取得


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    アプリケーションのライフサイクルを管理するコンテキストマネージャ。
    起動時にGeminiクライアントを初期化します。
    """
    logger.info("Application startup...")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set in the environment variables.")
    # アプリケーションの状態でクライアントを保持
    app.state.gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    logger.info("Gemini client initialized.")
    yield
    # アプリケーション終了時の処理
    logger.info("Application shutdown...")


# FastAPI アプリケーションのインスタンスを作成
app = FastAPI(
    title="AI Report Editor Service API",
    description="A FastAPI server providing an API for editing AI-generated reports.",
    version="1.0.0",
    lifespan=lifespan,
)

# レポートルーターを登録
app.include_router(diary_router)
# AIルーターを登録
app.include_router(ai_router)


@app.get("/")
def read_root() -> dict:
    """
    ウェルカムメッセージを返すエンドポイント。

    Returns:
        dict: ウェルカムメッセージを含む辞書。
    """
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to the AI Report Editor Service API!"}


@app.get("/error")
async def cause_error() -> dict:
    result = 1 / 0
    return {"result": result}


def main() -> None:
    uvicorn.run(app, host=APP_HOST, port=APP_PORT, log_level=LOG_LEVEL, access_log=True)


if __name__ == "__main__":
    main()
