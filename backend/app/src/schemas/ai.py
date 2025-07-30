from pydantic import BaseModel, Field


class DiaryCommentRequest(BaseModel):
    """日記コメント生成リクエスト"""

    diary_content: str = Field(
        ..., min_length=1, max_length=10000, description="日記の内容"
    )


class DiaryCommentResponse(BaseModel):
    """日記コメント生成レスポンス"""

    comment: str = Field(..., description="AIが生成したコメント")
