import json
import logging
from typing import Dict, Any
from anthropic import Anthropic
from app.config import get_settings
from app.schemas.recipe import RecipeGenerateRequest, RecipeCreate, IngredientSchema, InstructionSchema

logger = logging.getLogger(__name__)
settings = get_settings()


class AIRecipeGenerator:
    """Service for generating recipes using Claude AI."""

    def __init__(self):
        """Initialize the AI recipe generator."""
        if not settings.ANTHROPIC_API_KEY:
            raise ValueError("ANTHROPIC_API_KEY is not set in configuration")

        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = settings.CLAUDE_MODEL
        self.max_tokens = settings.MAX_TOKENS

    def _build_system_prompt(self) -> str:
        """Build the system prompt for Claude."""
        return """You are an expert culinary AI assistant with classical training equivalent to the Culinary Institute of America. Generate recipes that are:

- Precise with measurements and timing
- Technically sound with proper cooking methods
- Realistic for home cooks with common kitchen equipment
- Include chef tips and common pitfalls to avoid
- Culturally authentic when specifying a cuisine type

Output recipes in strict JSON format with the following structure:
{
  "title": "Recipe Name",
  "description": "Brief 1-2 sentence description of the dish",
  "servings": 4,
  "prep_time_minutes": 15,
  "cook_time_minutes": 30,
  "difficulty": "easy|medium|hard",
  "cuisine_type": "Italian",
  "dietary_tags": ["vegetarian", "gluten-free"],
  "ingredients": [
    {"item": "ingredient name", "amount": "2", "unit": "cups", "notes": "optional prep notes like 'diced' or 'room temperature'"}
  ],
  "instructions": [
    {"step": 1, "instruction": "Detailed step with specific techniques", "time_minutes": 5, "tip": "optional pro tip or what to look for"}
  ],
  "equipment_needed": ["large pot", "whisk", "baking sheet"],
  "chef_notes": "Additional tips, variations, or serving suggestions"
}

IMPORTANT:
- Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text
- Use realistic measurements and times
- Include helpful details in instruction steps
- Add tips for critical techniques or common mistakes
- Ensure ingredients list matches what's used in instructions"""

    def _build_user_prompt(self, request: RecipeGenerateRequest) -> str:
        """Build the user prompt from the request."""
        prompt_parts = [f"Generate a recipe for: {request.prompt}"]

        if request.servings:
            prompt_parts.append(f"Servings: {request.servings}")

        if request.dietary_restrictions:
            restrictions = ", ".join(request.dietary_restrictions)
            prompt_parts.append(f"Dietary restrictions: {restrictions}")

        if request.cuisine_type:
            prompt_parts.append(f"Cuisine type: {request.cuisine_type}")

        return "\n".join(prompt_parts)

    async def generate_recipe(self, request: RecipeGenerateRequest) -> RecipeCreate:
        """
        Generate a recipe using Claude AI.

        Args:
            request: Recipe generation request with prompt and parameters

        Returns:
            RecipeCreate schema with generated recipe data

        Raises:
            ValueError: If the AI response cannot be parsed
            Exception: If the API call fails
        """
        try:
            logger.info(f"Generating recipe for prompt: {request.prompt}")

            # Call Claude API
            message = self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                system=self._build_system_prompt(),
                messages=[
                    {
                        "role": "user",
                        "content": self._build_user_prompt(request)
                    }
                ]
            )

            # Extract the response text
            response_text = message.content[0].text
            logger.debug(f"AI Response: {response_text}")

            # Parse JSON response
            try:
                recipe_data = json.loads(response_text)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response as JSON: {e}")
                # Try to extract JSON from markdown code blocks if present
                if "```json" in response_text:
                    start = response_text.find("```json") + 7
                    end = response_text.find("```", start)
                    response_text = response_text[start:end].strip()
                    recipe_data = json.loads(response_text)
                else:
                    raise ValueError(f"AI response is not valid JSON: {response_text[:200]}")

            # Convert to Pydantic models
            ingredients = [IngredientSchema(**ing) for ing in recipe_data.get("ingredients", [])]
            instructions = [InstructionSchema(**inst) for inst in recipe_data.get("instructions", [])]

            # Create RecipeCreate schema
            recipe_create = RecipeCreate(
                title=recipe_data.get("title", "Untitled Recipe"),
                description=recipe_data.get("description"),
                ingredients=ingredients,
                instructions=instructions,
                prep_time_minutes=recipe_data.get("prep_time_minutes"),
                cook_time_minutes=recipe_data.get("cook_time_minutes"),
                servings=recipe_data.get("servings", request.servings),
                difficulty=recipe_data.get("difficulty"),
                cuisine_type=recipe_data.get("cuisine_type", request.cuisine_type),
                dietary_tags=recipe_data.get("dietary_tags", request.dietary_restrictions),
                equipment_needed=recipe_data.get("equipment_needed", []),
                chef_notes=recipe_data.get("chef_notes"),
                ai_prompt=request.prompt,
            )

            logger.info(f"Successfully generated recipe: {recipe_create.title}")
            return recipe_create

        except Exception as e:
            logger.error(f"Error generating recipe: {e}")
            raise


# Singleton instance
_ai_generator = None


def get_ai_generator() -> AIRecipeGenerator:
    """Get singleton AI recipe generator instance."""
    global _ai_generator
    if _ai_generator is None:
        _ai_generator = AIRecipeGenerator()
    return _ai_generator
