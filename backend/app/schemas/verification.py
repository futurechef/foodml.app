from pydantic import BaseModel, Field
from datetime import datetime


class VerificationCreate(BaseModel):
    """Schema for creating a verification."""
    recipe_id: int
    rating: float = Field(..., ge=1.0, le=5.0)
    feedback_text: str | None = None
    success: bool = True
    execution_time_minutes: int | None = Field(None, ge=0)


class VerificationResponse(BaseModel):
    """Schema for verification response."""
    id: int
    recipe_id: int
    user_id: int
    rating: float
    feedback_text: str | None
    success: bool
    execution_time_minutes: int | None
    created_at: datetime

    class Config:
        from_attributes = True


class VerificationListResponse(BaseModel):
    """Schema for list of verifications."""
    verifications: list[VerificationResponse]
    total: int
    avg_rating: float
    success_rate: float
