from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecipeRequest(BaseModel):
    ingredients: str

class RecipeResponse(BaseModel):
    title: str
    ingredients: List[str]
    instructions: List[str]

@app.post("/generate-recipe", response_model=RecipeResponse)
async def generate_recipe(request: RecipeRequest):
    # Mock implementation
    ingredients_list = [i.strip() for i in request.ingredients.split(',')]
    return {
        "title": "Mocktail Recipe",
        "ingredients": ingredients_list,
        "instructions": [
            "Mix all the ingredients together.",
            "Serve chilled.",
            "Enjoy your AI-generated creation!"
        ]
    }

@app.get("/")
async def root():
    return {"message": "FoodML API is running"}
