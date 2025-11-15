from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.models import Collection, CollectionRecipe, Recipe
from app.schemas.collection import CollectionCreate, CollectionUpdate


class CollectionService:
    """Service for collection database operations."""

    @staticmethod
    async def create_collection(
        db: AsyncSession,
        user_id: int,
        collection_data: CollectionCreate
    ) -> Collection:
        """Create a new collection."""
        collection = Collection(
            user_id=user_id,
            name=collection_data.name,
            description=collection_data.description,
            color=collection_data.color,
        )
        db.add(collection)
        await db.commit()
        await db.refresh(collection)
        return collection

    @staticmethod
    async def get_collection_by_id(db: AsyncSession, collection_id: int, user_id: int) -> Collection | None:
        """Get a collection by ID (must belong to user)."""
        query = select(Collection).where(
            Collection.id == collection_id,
            Collection.user_id == user_id
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_collections(
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[list[Collection], int]:
        """Get all collections for a user."""
        # Get total count
        count_query = select(func.count()).select_from(Collection).where(Collection.user_id == user_id)
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Get collections
        query = (
            select(Collection)
            .where(Collection.user_id == user_id)
            .order_by(desc(Collection.created_at))
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all(), total

    @staticmethod
    async def update_collection(
        db: AsyncSession,
        collection_id: int,
        user_id: int,
        update_data: CollectionUpdate
    ) -> Collection | None:
        """Update a collection."""
        collection = await CollectionService.get_collection_by_id(db, collection_id, user_id)
        if not collection:
            return None

        if update_data.name is not None:
            collection.name = update_data.name
        if update_data.description is not None:
            collection.description = update_data.description
        if update_data.color is not None:
            collection.color = update_data.color

        await db.commit()
        await db.refresh(collection)
        return collection

    @staticmethod
    async def delete_collection(db: AsyncSession, collection_id: int, user_id: int) -> bool:
        """Delete a collection."""
        collection = await CollectionService.get_collection_by_id(db, collection_id, user_id)
        if not collection:
            return False

        await db.delete(collection)
        await db.commit()
        return True

    @staticmethod
    async def add_recipe_to_collection(
        db: AsyncSession,
        collection_id: int,
        recipe_id: int,
        user_id: int
    ) -> bool:
        """Add a recipe to a collection."""
        # Verify collection exists and belongs to user
        collection = await CollectionService.get_collection_by_id(db, collection_id, user_id)
        if not collection:
            return False

        # Verify recipe exists
        recipe_query = select(Recipe).where(Recipe.id == recipe_id)
        recipe_result = await db.execute(recipe_query)
        if not recipe_result.scalar_one_or_none():
            return False

        # Check if already in collection
        check_query = select(CollectionRecipe).where(
            CollectionRecipe.collection_id == collection_id,
            CollectionRecipe.recipe_id == recipe_id
        )
        check_result = await db.execute(check_query)
        if check_result.scalar_one_or_none():
            return True  # Already in collection

        # Add recipe to collection
        collection_recipe = CollectionRecipe(
            collection_id=collection_id,
            recipe_id=recipe_id
        )
        db.add(collection_recipe)
        await db.commit()
        return True

    @staticmethod
    async def remove_recipe_from_collection(
        db: AsyncSession,
        collection_id: int,
        recipe_id: int,
        user_id: int
    ) -> bool:
        """Remove a recipe from a collection."""
        # Verify collection exists and belongs to user
        collection = await CollectionService.get_collection_by_id(db, collection_id, user_id)
        if not collection:
            return False

        query = select(CollectionRecipe).where(
            CollectionRecipe.collection_id == collection_id,
            CollectionRecipe.recipe_id == recipe_id
        )
        result = await db.execute(query)
        collection_recipe = result.scalar_one_or_none()

        if not collection_recipe:
            return False

        await db.delete(collection_recipe)
        await db.commit()
        return True

    @staticmethod
    async def get_collection_recipes(
        db: AsyncSession,
        collection_id: int,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[list[Recipe], int]:
        """Get all recipes in a collection."""
        # Verify collection exists and belongs to user
        collection = await CollectionService.get_collection_by_id(db, collection_id, user_id)
        if not collection:
            return [], 0

        # Get total count
        count_query = (
            select(func.count())
            .select_from(CollectionRecipe)
            .where(CollectionRecipe.collection_id == collection_id)
        )
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Get recipes
        query = (
            select(Recipe)
            .join(CollectionRecipe, Recipe.id == CollectionRecipe.recipe_id)
            .where(CollectionRecipe.collection_id == collection_id)
            .order_by(desc(CollectionRecipe.added_at))
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all(), total
