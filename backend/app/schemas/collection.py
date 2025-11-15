from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.recipe import RecipeResponse


class CollectionCreate(BaseModel):
    """Schema for creating a collection."""
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    color: str = Field(default="#3B82F6", regex=r"^#[0-9A-Fa-f]{6}$")


class CollectionUpdate(BaseModel):
    """Schema for updating a collection."""
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    color: str | None = Field(None, regex=r"^#[0-9A-Fa-f]{6}$")


class CollectionResponse(BaseModel):
    """Schema for collection response."""
    id: int
    name: str
    description: str | None = None
    color: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CollectionDetailResponse(CollectionResponse):
    """Schema for detailed collection response with recipes."""
    recipes: list[RecipeResponse] = Field(default_factory=list)


class CollectionListResponse(BaseModel):
    """Schema for paginated collection list."""
    collections: list[CollectionResponse]
    total: int
    page: int
    page_size: int


class AddRecipeToCollectionRequest(BaseModel):
    """Schema for adding a recipe to a collection."""
    recipe_id: int
