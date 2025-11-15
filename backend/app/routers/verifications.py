from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.schemas import VerificationCreate, VerificationResponse, VerificationListResponse
from app.services.auth import get_current_user
from app.services.recipe_service import RecipeService
from app.models import User, Verification, Recipe

router = APIRouter(prefix="/verifications", tags=["Verifications"])


@router.post("/", response_model=VerificationResponse, status_code=status.HTTP_201_CREATED)
async def create_verification(
    verification_data: VerificationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Submit a verification (feedback) for a recipe.

    Users can rate recipes they've tried and provide feedback on how it worked.
    """
    # Check if recipe exists
    recipe = await RecipeService.get_recipe_by_id(db, verification_data.recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )

    # Create verification
    verification = Verification(
        recipe_id=verification_data.recipe_id,
        user_id=current_user.id,
        rating=verification_data.rating,
        feedback_text=verification_data.feedback_text,
        success=verification_data.success,
        execution_time_minutes=verification_data.execution_time_minutes,
    )

    db.add(verification)
    await db.commit()
    await db.refresh(verification)

    # Update recipe statistics
    await RecipeService.update_recipe_stats(db, verification_data.recipe_id)

    return verification


@router.get("/recipe/{recipe_id}", response_model=VerificationListResponse)
async def get_recipe_verifications(
    recipe_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get all verifications for a specific recipe."""
    # Check if recipe exists
    recipe_query = select(Recipe).where(Recipe.id == recipe_id)
    recipe_result = await db.execute(recipe_query)
    recipe = recipe_result.scalar_one_or_none()

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )

    # Get total count
    count_query = select(func.count()).select_from(Verification).where(
        Verification.recipe_id == recipe_id
    )
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Get verifications with pagination
    skip = (page - 1) * page_size
    query = (
        select(Verification)
        .where(Verification.recipe_id == recipe_id)
        .order_by(Verification.created_at.desc())
        .offset(skip)
        .limit(page_size)
    )
    result = await db.execute(query)
    verifications = result.scalars().all()

    # Calculate stats
    if verifications:
        avg_rating = sum(v.rating for v in verifications) / len(verifications)
        success_count = sum(1 for v in verifications if v.success)
        success_rate = (success_count / len(verifications)) * 100
    else:
        avg_rating = 0.0
        success_rate = 0.0

    return VerificationListResponse(
        verifications=verifications,
        total=total,
        avg_rating=round(avg_rating, 2),
        success_rate=round(success_rate, 1)
    )


@router.get("/my-verifications", response_model=list[VerificationResponse])
async def get_my_verifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all verifications submitted by the current user."""
    query = (
        select(Verification)
        .where(Verification.user_id == current_user.id)
        .order_by(Verification.created_at.desc())
    )
    result = await db.execute(query)
    verifications = result.scalars().all()

    return verifications
