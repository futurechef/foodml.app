from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Collection(Base):
    """Recipe collection model for organizing recipes into cookbooks."""

    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    color = Column(String(7), default="#3B82F6")  # Hex color code

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="collections")
    recipes = relationship("CollectionRecipe", back_populates="collection", cascade="all, delete-orphan")


class CollectionRecipe(Base):
    """Association table for recipes in collections."""

    __tablename__ = "collection_recipes"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    collection = relationship("Collection", back_populates="recipes")
    recipe = relationship("Recipe")
