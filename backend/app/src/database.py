import os
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# .envファイルから環境変数を読み込み
load_dotenv()

# 環境変数からデータベース設定を取得
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "postgresserver")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "db")

# データベースURLの構築（非同期ドライバーasyncpgを使用）
SQLALCHEMY_DATABASE_URL = (
    f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

try:
    # データベースエンジンを作成
    async_engine = create_async_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # 接続の健全性をチェック
        echo=False,  # 本番環境ではFalseに設定
    )

    # データベースセッションを作成するためのクラス
    AsyncSessionLocal = async_sessionmaker(
        autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession
    )

except SQLAlchemyError as e:
    print(f"データベース接続エラー: {e}")
    raise


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """データベースセッションを取得するジェネレータ関数"""
    async with AsyncSessionLocal() as session:
        yield session
