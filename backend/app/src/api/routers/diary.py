import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.model import Diary
from src.repository.diary_repository import (
    create_diary,
    get_all_diaries,
    get_diary_by_id,
)
from src.schemas.diary import DiariesListResponse, DiaryCreateRequest, DiaryResponse

router = APIRouter(
    prefix="/diary",
    tags=["diary"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger("app")


@router.post("/", response_model=DiaryResponse)
async def create_new_diary(
    request: DiaryCreateRequest,
    db: AsyncSession = Depends(get_db),
) -> DiaryResponse:
    """
    新規日記作成エンドポイント。

    Args:
        request (DiaryCreateRequest): 日記作成リクエスト
        db (AsyncSession): データベースセッション

    Returns:
        DiaryResponse: 作成された日記情報
    """

    # リクエストの検証
    if not request.title or not request.title.strip():
        raise HTTPException(status_code=400, detail="タイトルが必要です")

    if not request.content or not request.content.strip():
        raise HTTPException(status_code=400, detail="内容が必要です")

    try:
        # 日記作成
        diary: Diary = await create_diary(
            db=db,
            title=request.title.strip(),
            content=request.content.strip(),
        )

        logger.info(f"日記作成成功: diary_id={diary.id}")

        return DiaryResponse(
            id=diary.id,
            title=diary.title,
            content=diary.content,
            created_at=diary.created_at,
            updated_at=diary.updated_at,
        )

    except Exception as e:
        logger.error(f"日記作成中にエラーが発生: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"日記の作成に失敗しました: {str(e)}"
        )


@router.get("/", response_model=DiariesListResponse)
async def get_diaries(
    db: AsyncSession = Depends(get_db),
) -> DiariesListResponse:
    """
    日記一覧取得エンドポイント。

    Args:
        db (AsyncSession): データベースセッション

    Returns:
        DiariesListResponse: 日記一覧と総件数
    """

    try:
        # 日記一覧取得
        diaries = await get_all_diaries(
            db=db,
        )

        # 総件数取得
        total_count = len(diaries)

        logger.info(f"日記一覧取得成功: total_count={total_count}")

        diary_responses = [
            DiaryResponse(
                id=diary.id,
                title=diary.title,
                content=diary.content,
                created_at=diary.created_at,
                updated_at=diary.updated_at,
            )
            for diary in diaries
        ]

        return DiariesListResponse(
            diaries=diary_responses,
            total_count=total_count,
        )

    except Exception as e:
        logger.error(f"日記一覧取得中にエラーが発生: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"日記一覧の取得に失敗しました: {str(e)}"
        )


@router.get("/{diary_id}", response_model=DiaryResponse)
async def get_diary(
    diary_id: int,
    db: AsyncSession = Depends(get_db),
) -> DiaryResponse:
    """
    日記詳細取得エンドポイント。

    Args:
        diary_id (int): 日記ID
        db (AsyncSession): データベースセッション

    Returns:
        DiaryResponse: 日記詳細情報
    """

    try:
        # 日記取得
        diary = await get_diary_by_id(db=db, diary_id=diary_id)

        if not diary:
            raise HTTPException(status_code=404, detail="日記が見つかりません")

        logger.info(f"日記詳細取得成功: diary_id={diary_id}")

        return DiaryResponse(
            id=diary.id,
            title=diary.title,
            content=diary.content,
            created_at=diary.created_at,
            updated_at=diary.updated_at,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"日記詳細取得中にエラーが発生: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"日記の取得に失敗しました: {str(e)}"
        )
