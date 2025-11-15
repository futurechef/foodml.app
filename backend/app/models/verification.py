from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Verification(Base):
    """Verification model for user feedback on recipes."""

    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Feedback
    rating = Column(Float, nullable=False)  # 1-5 stars
    feedback_text = Column(Text)
    success = Column(Boolean, default=True)  # Did the recipe work?
    execution_time_minutes = Column(Integer)  # Actual time taken

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    recipe = relationship("Recipe", back_populates="verifications")
    user = relationship("User", back_populates="verifications")
