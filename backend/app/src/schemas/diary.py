from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class DiaryCreateRequest(BaseModel):
    """日記作成リクエスト"""

    title: str = Field(..., min_length=1, max_length=200, description="日記のタイトル")
    content: str = Field(..., min_length=1, description="日記の内容")


class DiaryResponse(BaseModel):
    """日記レスポンス"""

    id: int = Field(..., description="日記ID")
    title: str = Field(..., description="日記のタイトル")
    content: str = Field(..., description="日記の内容")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="更新日時")

    class Config:
        from_attributes = True


class DiariesListResponse(BaseModel):
    """日記一覧レスポンス"""

    diaries: List[DiaryResponse] = Field(..., description="日記一覧")
    total_count: int = Field(..., description="総件数")

    class Config:
        from_attributes = True
