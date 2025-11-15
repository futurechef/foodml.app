import logging
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas import RecipeGenerateRequest, RecipeResponse, RecipeListResponse, RecipeSearchRequest
from app.services.auth import get_current_user
from app.services.ai_recipe_generator import get_ai_generator
from app.services.recipe_service import RecipeService
from app.models import User

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.post("/generate", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def generate_recipe(
    request: RecipeGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a new recipe using AI based on user prompt.

    This endpoint:
    1. Calls Claude AI to generate a recipe
    2. Stores the recipe in the database
    3. Returns the complete recipe to the user
    """
    try:
        # Generate recipe using AI
        ai_generator = get_ai_generator()
        recipe_data = await ai_generator.generate_recipe(request)

        # Save to database
        recipe = await RecipeService.create_recipe(db, recipe_data, current_user.id)

        # Convert to response format
        recipe.is_favorited = False
        return recipe

    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error generating recipe: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate recipe. Please try again."
        )


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific recipe by ID."""
    recipe = await RecipeService.get_recipe_by_id(db, recipe_id, current_user.id)

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )

    return recipe


@router.get("/", response_model=RecipeListResponse)
async def get_my_recipes(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all recipes created by the current user with pagination."""
    skip = (page - 1) * page_size
    recipes, total = await RecipeService.get_user_recipes(db, current_user.id, skip, page_size)

    return RecipeListResponse(
        recipes=recipes,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/favorites/list", response_model=RecipeListResponse)
async def get_favorite_recipes(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all favorited recipes for the current user."""
    skip = (page - 1) * page_size
    recipes, total = await RecipeService.get_favorites(db, current_user.id, skip, page_size)

    return RecipeListResponse(
        recipes=recipes,
        total=total,
        page=page,
        page_size=page_size
    )


@router.post("/{recipe_id}/favorite", status_code=status.HTTP_200_OK)
async def toggle_favorite(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Toggle favorite status for a recipe."""
    # Check if recipe exists
    recipe = await RecipeService.get_recipe_by_id(db, recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )

    is_favorited = await RecipeService.toggle_favorite(db, recipe_id, current_user.id)

    return {
        "recipe_id": recipe_id,
        "is_favorited": is_favorited,
        "message": "Recipe favorited" if is_favorited else "Recipe unfavorited"
    }


@router.get("/search/results", response_model=RecipeListResponse)
async def search_recipes(
    q: str = Query(None, description="Search query for title/description"),
    cuisine: str = Query(None, description="Filter by cuisine type"),
    difficulty: str = Query(None, description="Filter by difficulty (easy, medium, hard)"),
    min_rating: float = Query(0.0, ge=0.0, le=5.0, description="Minimum average rating"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Search recipes by title, description, cuisine, and other filters."""
    skip = (page - 1) * page_size
    recipes, total = await RecipeService.search_recipes(
        db,
        query=q,
        cuisine_type=cuisine,
        difficulty=difficulty,
        min_rating=min_rating,
        skip=skip,
        limit=page_size
    )

    return RecipeListResponse(
        recipes=recipes,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/trending/top", response_model=RecipeListResponse)
async def get_trending_recipes(
    min_verifications: int = Query(1, ge=0, description="Minimum number of verifications"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get trending recipes sorted by rating and verification count."""
    skip = (page - 1) * page_size
    recipes, total = await RecipeService.get_trending_recipes(
        db,
        min_verifications=min_verifications,
        skip=skip,
        limit=page_size
    )

    return RecipeListResponse(
        recipes=recipes,
        total=total,
        page=page,
        page_size=page_size
    )
