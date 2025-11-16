export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type RegisterRequest = LoginRequest;

export interface Ingredient {
  item: string;
  amount: string;
  unit: string;
  notes?: string | null;
}

export interface Instruction {
  step: number;
  instruction: string;
  time_minutes?: number | null;
  tip?: string | null;
}

export interface RecipeGenerateRequest {
  prompt: string;
  dietary_restrictions?: string[];
  servings?: number;
  cuisine_type?: string | null;
}

export interface Recipe {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  ingredients: Ingredient[];
  instructions: Instruction[];
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  servings: number;
  difficulty?: string | null;
  cuisine_type?: string | null;
  dietary_tags: string[];
  equipment_needed: string[];
  chef_notes?: string | null;
  ai_prompt: string;
  verified_count: number;
  avg_rating: number;
  generated_at: string;
  is_favorited: boolean;
}

export interface RecipeListResponse {
  recipes: Recipe[];
  total: number;
  page: number;
  page_size: number;
}

export interface Verification {
  id: number;
  recipe_id: number;
  user_id: number;
  rating: number;
  feedback_text?: string | null;
  success: boolean;
  execution_time_minutes?: number | null;
  created_at: string;
}

export interface VerificationCreate {
  recipe_id: number;
  rating: number;
  success: boolean;
  feedback_text?: string | null;
  execution_time_minutes?: number | null;
}

export interface VerificationListResponse {
  verifications: Verification[];
  total: number;
  avg_rating: number;
  success_rate: number;
}

export interface ToggleFavoriteResponse {
  recipe_id: number;
  is_favorited: boolean;
  message: string;
}

export interface Collection {
  id: number;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionDetail extends Collection {
  recipes: Recipe[];
}

export interface CollectionListResponse {
  collections: Collection[];
  total: number;
  page: number;
  page_size: number;
}

export interface CollectionCreateRequest {
  name: string;
  description?: string | null;
  color?: string;
}

export interface CollectionMutationResponse {
  message: string;
  collection_id: number;
  recipe_id: number;
}
