import logging

from fastapi import APIRouter, HTTPException, Request

from src.schemas.ai import DiaryCommentRequest, DiaryCommentResponse
from src.services.ai_service import AIService

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger("app")


def get_ai_service(request: Request) -> AIService:
    """依存性注入によりAIServiceのインスタンスを取得します。"""
    client = getattr(request.app.state, "gemini_client", None)
    if not client:
        raise HTTPException(status_code=500, detail="Gemini client is not initialized.")
    return AIService(client=client)


@router.post("/comment", response_model=DiaryCommentResponse)
async def generate_diary_comment(
    request: Request,
) -> DiaryCommentResponse:
    """
    日記の内容に対してAIがコメントを生成するエンドポイント。

    Args:
        request (DiaryCommentRequest): 日記コメント生成リクエスト

    Returns:
        DiaryCommentResponse: AIが生成したコメント
    """

    try:
        raw_body = await request.json()
        ai_request = DiaryCommentRequest(**raw_body)
    except ValueError as e:
        logger.error(f"リクエストのバリデーションエラー: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    # リクエストの検証
    if not ai_request.diary_content or not ai_request.diary_content.strip():
        raise HTTPException(status_code=400, detail="日記の内容が必要です")

    try:
        ai_service = get_ai_service(request)

        # AIコメント生成
        comment = await ai_service.comment_on_diary(
            diary_content=ai_request.diary_content.strip()
        )

        logger.info(f"AIコメント生成成功: comment_length={len(comment)}")

        return DiaryCommentResponse(comment=comment)

    except ValueError as e:
        logger.error(f"バリデーションエラー: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        logger.error(f"AIサービスエラー: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"AIコメント生成中にエラーが発生: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"コメントの生成に失敗しました: {str(e)}"
        )
