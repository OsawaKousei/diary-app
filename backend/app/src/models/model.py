from sqlalchemy import TIMESTAMP, Column, Integer, String, Text, func
from sqlalchemy.orm import declarative_base

# SQLAlchemyの基本的な設定
Base = declarative_base()


class Diary(Base):
    """日記テーブル"""

    __tablename__ = "diaries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, default=func.now())
    updated_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=func.now(),
        onupdate=func.now(),
    )
