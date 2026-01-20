
# from pydantic import (
#     BaseModel,
#     EmailStr,
#     field_validator,
#     model_validator,
#     ConfigDict,
# )
# from typing import Optional, Literal
# from datetime import date
# from uuid import UUID


# # =========================
# # Base Schema (INPUT)
# # =========================
# class CandidateBase(BaseModel):
#     first_name: str
#     last_name: str
#     phone: str
#     email: EmailStr
#     address: Optional[str] = None

#     highest_qualification: str
#     experience_type: Literal["fresher", "experienced"]

#     previous_company: Optional[str] = None
#     role: Optional[str] = None
#     company_location: Optional[str] = None
#     total_experience_years: Optional[int] = None

#     current_ctc: Optional[int] = None
#     expected_ctc: int
#     notice_period_days: Optional[int] = None

#     immediate_joining: bool = False
#     date_of_joining: Optional[date] = None

#     # 🔗 NEW (Position mapping)
#     # position_id: Optional[UUID] = None

#     # 📄 Resume & Profile
#     # upload_resume_path: Optional[str] = None
#     # linkedin_profile: Optional[str] = None

#     # -------------------------
#     # Validators
#     # -------------------------
#     @field_validator("expected_ctc")
#     @classmethod
#     def expected_ctc_non_negative(cls, v: int) -> int:
#         if v < 0:
#             raise ValueError("expected_ctc must be >= 0")
#         return v

#     @model_validator(mode="after")
#     def validate_experience_rules(self):
#         if self.experience_type == "fresher":
#             self.previous_company = None
#             self.role = None
#             self.company_location = None
#             self.total_experience_years = None
#             self.current_ctc = None
#             self.notice_period_days = None
#             self.immediate_joining = True
#         else:
#             if self.total_experience_years is None:
#                 raise ValueError(
#                     "total_experience_years is required for experienced candidates"
#                 )
#         return self


# # =========================
# # Create Schema
# # =========================
# class CandidateCreate(CandidateBase):
#     pass


# # =========================
# # Update Schema (PATCH)
# # =========================
# class CandidateUpdate(BaseModel):
#     first_name: Optional[str] = None
#     last_name: Optional[str] = None
#     phone: Optional[str] = None
#     email: Optional[EmailStr] = None
#     address: Optional[str] = None

#     highest_qualification: Optional[str] = None
#     experience_type: Optional[Literal["fresher", "experienced"]] = None

#     previous_company: Optional[str] = None
#     role: Optional[str] = None
#     company_location: Optional[str] = None
#     total_experience_years: Optional[int] = None

#     current_ctc: Optional[int] = None
#     expected_ctc: Optional[int] = None
#     notice_period_days: Optional[int] = None

#     immediate_joining: Optional[bool] = None
#     date_of_joining: Optional[date] = None

#     position_id: Optional[UUID] = None
#     # upload_resume_path: Optional[str] = None
#     # linkedin_profile: Optional[str] = None


# # =========================
# # Response Schema (OUTPUT)
# # =========================
# class CandidateResponse(BaseModel):
#     id: UUID
#     first_name: str
#     last_name: str
#     phone: str
#     email: EmailStr

#     highest_qualification: str
#     experience_type: str

#     expected_ctc: int
#     resume_url: Optional[str]
    
#     # position_id: Optional[UUID]

#     # linkedin_profile: Optional[str]
#     # upload_resume_path: Optional[str]

#     is_active: bool

#     model_config = ConfigDict(from_attributes=True)







from pydantic import (
    BaseModel,
    EmailStr,
    field_validator,
    model_validator,
    ConfigDict,
)
from typing import Optional, Literal
from datetime import date
from uuid import UUID


# =========================
# Base Schema (INPUT)
# =========================
class CandidateBase(BaseModel):
    first_name: str
    last_name: str
    phone: str
    email: EmailStr
    address: Optional[str] = None

    highest_qualification: str
    experience_type: Literal["fresher", "experienced"]

    previous_company: Optional[str] = None
    role: Optional[str] = None
    company_location: Optional[str] = None
    total_experience_years: Optional[int] = None

    current_ctc: Optional[int] = None
    expected_ctc: int
    notice_period_days: Optional[int] = None

    immediate_joining: bool = False
    date_of_joining: Optional[date] = None

    # -------------------------
    # Validators
    # -------------------------
    @field_validator("expected_ctc")
    @classmethod
    def expected_ctc_non_negative(cls, v: int) -> int:
        if v < 0:
            raise ValueError("expected_ctc must be >= 0")
        return v

    @model_validator(mode="after")
    def validate_experience_rules(self):
        """
        Only VALIDATE here.
        Do NOT mutate values (business logic lives in service layer).
        """
        if self.experience_type == "experienced":
            if self.total_experience_years is None:
                raise ValueError(
                    "total_experience_years is required for experienced candidates"
                )
        return self


# =========================
# Create Schema
# =========================
class CandidateCreate(CandidateBase):
    """
    JSON-only payload.
    Resume file is handled separately via UploadFile.
    """
    pass


# =========================
# Update Schema (PATCH)
# =========================
class CandidateUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None

    highest_qualification: Optional[str] = None
    experience_type: Optional[Literal["fresher", "experienced"]] = None

    previous_company: Optional[str] = None
    role: Optional[str] = None
    company_location: Optional[str] = None
    total_experience_years: Optional[int] = None

    current_ctc: Optional[int] = None
    expected_ctc: Optional[int] = None
    notice_period_days: Optional[int] = None

    immediate_joining: Optional[bool] = None
    date_of_joining: Optional[date] = None

    # ❌ position_id REMOVED (not yet in model)
    # ❌ resume fields REMOVED (handled via upload API)


# =========================
# Response Schema (OUTPUT)
# =========================
class CandidateResponse(BaseModel):
    id: UUID

    first_name: str
    last_name: str
    phone: str
    email: EmailStr

    highest_qualification: str
    experience_type: str

    current_ctc: Optional[int]
    expected_ctc: int

    resume_url: Optional[str]

    is_active: bool

    model_config = ConfigDict(from_attributes=True)
