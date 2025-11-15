from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Recipe(Base):
    """Recipe model for storing AI-generated recipes."""

    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Basic info
    title = Column(String(255), nullable=False)
    description = Column(Text)
    ai_prompt = Column(Text, nullable=False)

    # Recipe details (JSON stored as PostgreSQL JSON type)
    ingredients = Column(JSON, nullable=False)
    instructions = Column(JSON, nullable=False)
    equipment_needed = Column(JSON, default=list)

    # Timing and difficulty
    prep_time_minutes = Column(Integer)
    cook_time_minutes = Column(Integer)
    servings = Column(Integer, default=4)
    difficulty = Column(String(50))  # easy, medium, hard

    # Classification
    cuisine_type = Column(String(100))
    dietary_tags = Column(JSON, default=list)

    # Verification stats
    verified_count = Column(Integer, default=0)
    avg_rating = Column(Float, default=0.0)

    # Notes
    chef_notes = Column(Text)

    # Timestamps
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="recipes")
    verifications = relationship("Verification", back_populates="recipe", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="recipe", cascade="all, delete-orphan")


class Favorite(Base):
    """Favorite model for users to save recipes."""

    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="favorites")
    recipe = relationship("Recipe", back_populates="favorites")
