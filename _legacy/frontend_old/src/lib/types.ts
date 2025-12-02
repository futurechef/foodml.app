// User types
export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Recipe types
export interface Ingredient {
  item: string;
  amount: string;
  unit: string;
  notes?: string;
}

export interface Instruction {
  step: number;
  instruction: string;
  time_minutes?: number;
  tip?: string;
}

export interface Recipe {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  ai_prompt: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  equipment_needed: string[];
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  servings: number;
  difficulty?: string;
  cuisine_type?: string;
  dietary_tags: string[];
  chef_notes?: string;
  verified_count: number;
  avg_rating: number;
  generated_at: string;
  is_favorited: boolean;
}

export interface RecipeGenerateRequest {
  prompt: string;
  dietary_restrictions?: string[];
  servings?: number;
  cuisine_type?: string;
}

export interface RecipeListResponse {
  recipes: Recipe[];
  total: number;
  page: number;
  page_size: number;
}

// Verification types
export interface Verification {
  id: number;
  recipe_id: number;
  user_id: number;
  rating: number;
  feedback_text?: string;
  success: boolean;
  execution_time_minutes?: number;
  created_at: string;
}

export interface VerificationCreate {
  recipe_id: number;
  rating: number;
  feedback_text?: string;
  success: boolean;
  execution_time_minutes?: number;
}

export interface VerificationListResponse {
  verifications: Verification[];
  total: number;
  avg_rating: number;
  success_rate: number;
}

// API Error
export interface APIError {
  detail: string;
}
