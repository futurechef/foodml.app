from pydantic import BaseModel, Field
from datetime import datetime


class IngredientSchema(BaseModel):
    """Schema for recipe ingredient."""
    item: str
    amount: str
    unit: str
    notes: str | None = None


class InstructionSchema(BaseModel):
    """Schema for recipe instruction step."""
    step: int
    instruction: str
    time_minutes: int | None = None
    tip: str | None = None


class RecipeGenerateRequest(BaseModel):
    """Schema for recipe generation request."""
    prompt: str = Field(..., min_length=5, max_length=500)
    dietary_restrictions: list[str] = Field(default_factory=list)
    servings: int = Field(default=4, ge=1, le=12)
    cuisine_type: str | None = None


class RecipeBase(BaseModel):
    """Base recipe schema."""
    title: str
    description: str | None = None
    ingredients: list[IngredientSchema]
    instructions: list[InstructionSchema]
    prep_time_minutes: int | None = None
    cook_time_minutes: int | None = None
    servings: int = 4
    difficulty: str | None = None
    cuisine_type: str | None = None
    dietary_tags: list[str] = Field(default_factory=list)
    equipment_needed: list[str] = Field(default_factory=list)
    chef_notes: str | None = None


class RecipeCreate(RecipeBase):
    """Schema for creating a recipe."""
    ai_prompt: str


class RecipeResponse(RecipeBase):
    """Schema for recipe response."""
    id: int
    user_id: int
    ai_prompt: str
    verified_count: int = 0
    avg_rating: float = 0.0
    generated_at: datetime
    is_favorited: bool = False

    class Config:
        from_attributes = True


class RecipeListResponse(BaseModel):
    """Schema for paginated recipe list."""
    recipes: list[RecipeResponse]
    total: int
    page: int
    page_size: int


class RecipeSearchRequest(BaseModel):
    """Schema for recipe search request."""
    query: str | None = None
    cuisine_type: str | None = None
    dietary_tags: list[str] = Field(default_factory=list)
    difficulty: str | None = None
    min_rating: float = Field(default=0.0, ge=0.0, le=5.0)


class FavoriteResponse(BaseModel):
    """Schema for favorite response."""
    id: int
    recipe_id: int
    created_at: datetime

    class Config:
        from_attributes = True
