from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

# Load environment variables from .env file (for local dev)
load_dotenv()

app = FastAPI()

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    print("WARNING: GEMINI_API_KEY not set. Recipe generation will fail.")

genai.configure(api_key=GOOGLE_API_KEY)

# Use a model that supports JSON mode well
model = genai.GenerativeModel('gemini-1.5-flash')

class RecipeRequest(BaseModel):
    ingredients: str

class RecipeResponse(BaseModel):
    title: str
    ingredients: List[str]
    instructions: List[str]

@app.post("/generate-recipe", response_model=RecipeResponse)
async def generate_recipe(request: RecipeRequest):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Server configuration error: API Key missing")

    prompt = f"""
    You are a professional chef and recipe developer. 
    Create a delicious recipe using these ingredients/notes: "{request.ingredients}".
    
    You may add common pantry staples (oil, salt, pepper, water, basic spices) if needed, but focus on the provided ingredients.
    
    Return ONLY a JSON object with the following structure:
    {{
        "title": "Recipe Title",
        "ingredients": ["1 cup rice", "200g chicken breast", ...],
        "instructions": ["Step 1...", "Step 2...", ...]
    }}
    Do not include markdown formatting (like ```json). Just the raw JSON string.
    """

    try:
        response = model.generate_content(prompt)
        
        # Clean up potential markdown formatting if the model ignores instructions
        text_response = response.text.strip()
        if text_response.startswith("```json"):
            text_response = text_response[7:]
        if text_response.endswith("```"):
            text_response = text_response[:-3]
            
        recipe_data = json.loads(text_response)
        return recipe_data
        
    except Exception as e:
        print(f"Error generating recipe: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate recipe. Please try again.")

@app.get("/")
async def root():
    return {"message": "FoodML API is running"}
