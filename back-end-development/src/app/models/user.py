# src/app/models/user.py

import uuid
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from src.app.core.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # =========================
    # BASIC IDENTITY
    # =========================
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)

    # =========================
    # ROLE & STATUS
    # =========================
    role = Column(
        String(50),
        nullable=False,
        index=True,
        comment="ADMIN / HR / RECRUITER / INTERVIEWER"
    )

    is_active = Column(Boolean, default=True, nullable=False)

    # =========================
    # AUDIT
    # =========================
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
