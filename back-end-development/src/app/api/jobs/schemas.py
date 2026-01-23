from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    experience_min_years: Optional[int] = None
    experience_max_years: Optional[int] = None
    openings: int = 1
    description: Optional[str] = None
    linkedin_url: Optional[str] = None


class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    experience_min_years: Optional[int] = None
    experience_max_years: Optional[int] = None
    openings: Optional[int] = None
    description: Optional[str] = None
    linkedin_url: Optional[str] = None
    status: Optional[str] = Field(None, description="OPEN / CLOSED / ON_HOLD")


class JobResponse(BaseModel):
    id: UUID
    title: str
    department: Optional[str]
    location: Optional[str]
    employment_type: Optional[str]
    experience_min_years: Optional[int]
    experience_max_years: Optional[int]
    openings: int
    description: Optional[str]
    linkedin_url: Optional[str]
    status: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
