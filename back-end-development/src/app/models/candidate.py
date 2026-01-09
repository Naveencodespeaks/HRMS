from sqlalchemy import String, Boolean, Integer, Column
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.models.base import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(15), unique=True, index=True, nullable=False)
    position_applied: Mapped[str] = mapped_column(String(100), nullable=False)
    resume_link: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="applied", nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)