import logging
from typing import List, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.model import Diary

logger = logging.getLogger("app")


async def get_diary_by_id(db: AsyncSession, diary_id: int) -> Optional[Diary]:
    """IDで日記を取得"""
    result = await db.execute(select(Diary).where(Diary.id == diary_id))
    return result.scalar_one_or_none()


async def get_all_diaries(db: AsyncSession) -> List[Diary]:
    """全ての日記を取得（作成日時の降順）"""
    result = await db.execute(select(Diary).order_by(Diary.created_at.desc()))
    return list(result.scalars().all())


async def create_diary(db: AsyncSession, title: str, content: str) -> Diary:
    """新規日記を作成"""
    new_diary: Diary = Diary(
        title=title,
        content=content,
        created_at=func.now(),
        updated_at=func.now(),
    )
    db.add(new_diary)
    try:
        await db.commit()
        await db.refresh(new_diary)
    except Exception as e:
        await db.rollback()
        logger.error(f"日記作成中にエラーが発生: {e}")
        raise

    logger.info(f"新規日記作成: diary_id={new_diary.id}")
    return new_diary
