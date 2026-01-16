from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class PositionBase(BaseModel):
    title: str
    department: str
    location: str | None = None
    description: str | None = None


class PositionCreate(PositionBase):
    pass


class PositionResponse(PositionBase):
    id: UUID
    is_open: bool
    created_at: datetime

    class Config:
        from_attributes = True
