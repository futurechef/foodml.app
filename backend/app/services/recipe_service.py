from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_, and_
from sqlalchemy.orm import selectinload
from app.models import Recipe, Favorite, Verification
from app.schemas.recipe import RecipeCreate


class RecipeService:
    """Service for recipe database operations."""

    @staticmethod
    async def create_recipe(db: AsyncSession, recipe_data: RecipeCreate, user_id: int) -> Recipe:
        """Create a new recipe in the database."""
        # Convert Pydantic models to dicts for JSON storage
        ingredients_dict = [ing.model_dump() for ing in recipe_data.ingredients]
        instructions_dict = [inst.model_dump() for inst in recipe_data.instructions]

        recipe = Recipe(
            user_id=user_id,
            title=recipe_data.title,
            description=recipe_data.description,
            ai_prompt=recipe_data.ai_prompt,
            ingredients=ingredients_dict,
            instructions=instructions_dict,
            equipment_needed=recipe_data.equipment_needed,
            prep_time_minutes=recipe_data.prep_time_minutes,
            cook_time_minutes=recipe_data.cook_time_minutes,
            servings=recipe_data.servings,
            difficulty=recipe_data.difficulty,
            cuisine_type=recipe_data.cuisine_type,
            dietary_tags=recipe_data.dietary_tags,
            chef_notes=recipe_data.chef_notes,
        )

        db.add(recipe)
        await db.commit()
        await db.refresh(recipe)
        return recipe

    @staticmethod
    async def get_recipe_by_id(db: AsyncSession, recipe_id: int, user_id: int | None = None) -> Recipe | None:
        """Get a recipe by ID."""
        query = select(Recipe).where(Recipe.id == recipe_id)
        result = await db.execute(query)
        recipe = result.scalar_one_or_none()

        if recipe and user_id:
            # Check if favorited
            fav_query = select(Favorite).where(
                Favorite.recipe_id == recipe_id,
                Favorite.user_id == user_id
            )
            fav_result = await db.execute(fav_query)
            recipe.is_favorited = fav_result.scalar_one_or_none() is not None
        else:
            recipe.is_favorited = False

        return recipe

    @staticmethod
    async def get_user_recipes(
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[list[Recipe], int]:
        """Get all recipes for a user with pagination."""
        # Get total count
        count_query = select(func.count()).select_from(Recipe).where(Recipe.user_id == user_id)
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Get recipes
        query = (
            select(Recipe)
            .where(Recipe.user_id == user_id)
            .order_by(desc(Recipe.generated_at))
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        recipes = result.scalars().all()

        # Check which are favorited
        for recipe in recipes:
            fav_query = select(Favorite).where(
                Favorite.recipe_id == recipe.id,
                Favorite.user_id == user_id
            )
            fav_result = await db.execute(fav_query)
            recipe.is_favorited = fav_result.scalar_one_or_none() is not None

        return recipes, total

    @staticmethod
    async def get_favorites(
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[list[Recipe], int]:
        """Get favorited recipes for a user."""
        # Get total count
        count_query = (
            select(func.count())
            .select_from(Favorite)
            .where(Favorite.user_id == user_id)
        )
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Get favorite recipes
        query = (
            select(Recipe)
            .join(Favorite, Recipe.id == Favorite.recipe_id)
            .where(Favorite.user_id == user_id)
            .order_by(desc(Favorite.created_at))
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        recipes = result.scalars().all()

        # Mark all as favorited
        for recipe in recipes:
            recipe.is_favorited = True

        return recipes, total

    @staticmethod
    async def toggle_favorite(db: AsyncSession, recipe_id: int, user_id: int) -> bool:
        """
        Toggle favorite status for a recipe.

        Returns:
            True if favorited, False if unfavorited
        """
        query = select(Favorite).where(
            Favorite.recipe_id == recipe_id,
            Favorite.user_id == user_id
        )
        result = await db.execute(query)
        favorite = result.scalar_one_or_none()

        if favorite:
            # Unfavorite
            await db.delete(favorite)
            await db.commit()
            return False
        else:
            # Favorite
            favorite = Favorite(recipe_id=recipe_id, user_id=user_id)
            db.add(favorite)
            await db.commit()
            return True

    @staticmethod
    async def update_recipe_stats(db: AsyncSession, recipe_id: int):
        """Update verification statistics for a recipe."""
        # Get all verifications for this recipe
        query = select(Verification).where(Verification.recipe_id == recipe_id)
        result = await db.execute(query)
        verifications = result.scalars().all()

        if not verifications:
            return

        # Calculate stats
        verified_count = len(verifications)
        avg_rating = sum(v.rating for v in verifications) / verified_count

        # Update recipe
        recipe_query = select(Recipe).where(Recipe.id == recipe_id)
        recipe_result = await db.execute(recipe_query)
        recipe = recipe_result.scalar_one_or_none()

        if recipe:
            recipe.verified_count = verified_count
            recipe.avg_rating = round(avg_rating, 2)
            await db.commit()

    @staticmethod
    async def search_recipes(
        db: AsyncSession,
        query: str | None = None,
        cuisine_type: str | None = None,
        dietary_tags: list[str] | None = None,
        difficulty: str | None = None,
        min_rating: float = 0.0,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[list[Recipe], int]:
        """Search recipes by multiple criteria."""
        filters = []

        # Text search in title and description
        if query:
            search_term = f"%{query}%"
            filters.append(
                or_(
                    Recipe.title.ilike(search_term),
                    Recipe.description.ilike(search_term)
                )
            )

        # Cuisine type filter
        if cuisine_type:
            filters.append(Recipe.cuisine_type.ilike(f"%{cuisine_type}%"))

        # Difficulty filter
        if difficulty:
            filters.append(Recipe.difficulty.ilike(difficulty))

        # Minimum rating filter
        filters.append(Recipe.avg_rating >= min_rating)

        # Build query
        base_query = select(Recipe)
        if filters:
            base_query = base_query.where(and_(*filters))

        # Get total count
        count_query = select(func.count()).select_from(Recipe)
        if filters:
            count_query = count_query.where(and_(*filters))
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Get paginated results
        query_result = (
            base_query
            .order_by(desc(Recipe.avg_rating), desc(Recipe.generated_at))
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query_result)
        recipes = result.scalars().all()

        return recipes, total

    @staticmethod
    async def get_trending_recipes(
        db: AsyncSession,
        min_verifications: int = 1,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[list[Recipe], int]:
        """Get trending recipes sorted by rating and verification count."""
        # Get total count of recipes with at least min_verifications
        count_query = (
            select(func.count())
            .select_from(Recipe)
            .where(Recipe.verified_count >= min_verifications)
        )
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Get trending recipes
        query = (
            select(Recipe)
            .where(Recipe.verified_count >= min_verifications)
            .order_by(
                desc(Recipe.avg_rating),
                desc(Recipe.verified_count),
                desc(Recipe.generated_at)
            )
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        recipes = result.scalars().all()

        return recipes, total
