import logging
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas import (
    CollectionCreate,
    CollectionUpdate,
    CollectionResponse,
    CollectionDetailResponse,
    CollectionListResponse,
    AddRecipeToCollectionRequest,
    RecipeListResponse,
)
from app.services.auth import get_current_user
from app.services.collection_service import CollectionService
from app.models import User

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/collections", tags=["Collections"])


@router.post("", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
async def create_collection(
    request: CollectionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new recipe collection."""
    try:
        collection = await CollectionService.create_collection(
            db, current_user.id, request
        )
        return collection
    except Exception as e:
        logger.error(f"Error creating collection: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create collection"
        )


@router.get("", response_model=CollectionListResponse)
async def list_collections(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all collections for the current user."""
    skip = (page - 1) * page_size
    collections, total = await CollectionService.get_user_collections(
        db, current_user.id, skip, page_size
    )

    return CollectionListResponse(
        collections=collections,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{collection_id}", response_model=CollectionDetailResponse)
async def get_collection(
    collection_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific collection with its recipes."""
    collection = await CollectionService.get_collection_by_id(
        db, collection_id, current_user.id
    )

    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found"
        )

    skip = (page - 1) * page_size
    recipes, total = await CollectionService.get_collection_recipes(
        db, collection_id, current_user.id, skip, page_size
    )

    return CollectionDetailResponse(
        id=collection.id,
        name=collection.name,
        description=collection.description,
        color=collection.color,
        created_at=collection.created_at,
        updated_at=collection.updated_at,
        recipes=recipes
    )


@router.put("/{collection_id}", response_model=CollectionResponse)
async def update_collection(
    collection_id: int,
    request: CollectionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a collection."""
    collection = await CollectionService.update_collection(
        db, collection_id, current_user.id, request
    )

    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found"
        )

    return collection


@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a collection."""
    deleted = await CollectionService.delete_collection(
        db, collection_id, current_user.id
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found"
        )


@router.post("/{collection_id}/recipes", status_code=status.HTTP_200_OK)
async def add_recipe_to_collection(
    collection_id: int,
    request: AddRecipeToCollectionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a recipe to a collection."""
    success = await CollectionService.add_recipe_to_collection(
        db, collection_id, request.recipe_id, current_user.id
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection or recipe not found"
        )

    return {
        "message": "Recipe added to collection",
        "collection_id": collection_id,
        "recipe_id": request.recipe_id
    }


@router.delete("/{collection_id}/recipes/{recipe_id}", status_code=status.HTTP_200_OK)
async def remove_recipe_from_collection(
    collection_id: int,
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove a recipe from a collection."""
    success = await CollectionService.remove_recipe_from_collection(
        db, collection_id, recipe_id, current_user.id
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection or recipe not found"
        )

    return {
        "message": "Recipe removed from collection",
        "collection_id": collection_id,
        "recipe_id": recipe_id
    }
