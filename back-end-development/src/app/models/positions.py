import uuid
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from src.app.core.db import Base


class Position(Base):
    __tablename__ = "positions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title = Column(String(150), nullable=False)
    department = Column(String(100), nullable=False)
    location = Column(String(100), nullable=True)

    description = Column(Text, nullable=True)

    is_open = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
