import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Recipe,
  RecipeGenerateRequest,
  RecipeListResponse,
  Verification,
  VerificationCreate,
  VerificationListResponse,
  APIError,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<APIError>) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Public client for advanced usage
  getClient(): AxiosInstance {
    return this.client;
  }

  // Token management
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Authentication
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    this.setToken(response.data.access_token);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    this.setToken(response.data.access_token);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  logout(): void {
    this.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Recipes
  async generateRecipe(data: RecipeGenerateRequest): Promise<Recipe> {
    const response = await this.client.post<Recipe>('/recipes/generate', data);
    return response.data;
  }

  async getRecipe(id: number): Promise<Recipe> {
    const response = await this.client.get<Recipe>(`/recipes/${id}`);
    return response.data;
  }

  async getMyRecipes(page: number = 1, pageSize: number = 20): Promise<RecipeListResponse> {
    const response = await this.client.get<RecipeListResponse>('/recipes/', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async getFavoriteRecipes(page: number = 1, pageSize: number = 20): Promise<RecipeListResponse> {
    const response = await this.client.get<RecipeListResponse>('/recipes/favorites/list', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async toggleFavorite(recipeId: number): Promise<{ is_favorited: boolean }> {
    const response = await this.client.post<{ is_favorited: boolean }>(
      `/recipes/${recipeId}/favorite`
    );
    return response.data;
  }

  async searchRecipes(
    q?: string,
    cuisine?: string,
    difficulty?: string,
    minRating?: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<RecipeListResponse> {
    const response = await this.client.get<RecipeListResponse>('/recipes/search/results', {
      params: { q, cuisine, difficulty, min_rating: minRating, page, page_size: pageSize },
    });
    return response.data;
  }

  async getTrendingRecipes(
    minVerifications: number = 1,
    page: number = 1,
    pageSize: number = 20
  ): Promise<RecipeListResponse> {
    const response = await this.client.get<RecipeListResponse>('/recipes/trending/top', {
      params: { min_verifications: minVerifications, page, page_size: pageSize },
    });
    return response.data;
  }

  // Collections
  async getCollections(page: number = 1, pageSize: number = 20): Promise<any> {
    const response = await this.client.get('/collections', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async getCollection(collectionId: number, page: number = 1, pageSize: number = 20): Promise<any> {
    const response = await this.client.get(`/collections/${collectionId}`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async createCollection(data: any): Promise<any> {
    const response = await this.client.post('/collections', data);
    return response.data;
  }

  async updateCollection(collectionId: number, data: any): Promise<any> {
    const response = await this.client.put(`/collections/${collectionId}`, data);
    return response.data;
  }

  async deleteCollection(collectionId: number): Promise<void> {
    await this.client.delete(`/collections/${collectionId}`);
  }

  async addRecipeToCollection(collectionId: number, recipeId: number): Promise<any> {
    const response = await this.client.post(`/collections/${collectionId}/recipes`, {
      recipe_id: recipeId,
    });
    return response.data;
  }

  async removeRecipeFromCollection(collectionId: number, recipeId: number): Promise<any> {
    const response = await this.client.delete(`/collections/${collectionId}/recipes/${recipeId}`);
    return response.data;
  }

  // Verifications
  async createVerification(data: VerificationCreate): Promise<Verification> {
    const response = await this.client.post<Verification>('/verifications/', data);
    return response.data;
  }

  async getRecipeVerifications(
    recipeId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<VerificationListResponse> {
    const response = await this.client.get<VerificationListResponse>(
      `/verifications/recipe/${recipeId}`,
      {
        params: { page, page_size: pageSize },
      }
    );
    return response.data;
  }

  async getMyVerifications(): Promise<Verification[]> {
    const response = await this.client.get<Verification[]>('/verifications/my-verifications');
    return response.data;
  }

  // Utility to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Export singleton instance
export const api = new APIClient();
