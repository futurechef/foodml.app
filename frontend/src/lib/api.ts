import axios, { AxiosInstance } from 'axios';
import {
  LoginRequest,
  RegisterRequest,
  RecipeGenerateRequest,
  Recipe,
  RecipeListResponse,
  VerificationCreate,
  Verification,
  VerificationListResponse,
  CollectionListResponse,
  CollectionCreateRequest,
  Collection,
  CollectionDetail,
  CollectionMutationResponse,
  ToggleFavoriteResponse,
  TokenResponse,
} from './types';

class ApiClient {
  private client: AxiosInstance;
  private readonly tokenKey = 'foodml_token';

  constructor() {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

    this.client = axios.create({
      baseURL: `${baseUrl}/api`,
    });

    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private isBrowser() {
    return typeof window !== 'undefined';
  }

  private getToken() {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private clearToken() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private handleUnauthorized() {
    this.clearToken();
    if (this.isBrowser() && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  public isAuthenticated() {
    return Boolean(this.getToken());
  }

  public logout(redirect = true) {
    this.clearToken();
    if (redirect && this.isBrowser()) {
      window.location.href = '/login';
    }
  }

  async login(data: LoginRequest) {
    const response = await this.client.post<TokenResponse>('/auth/login', data);
    this.setToken(response.data.access_token);
    return response.data;
  }

  async register(data: RegisterRequest) {
    const response = await this.client.post<TokenResponse>('/auth/register', data);
    this.setToken(response.data.access_token);
    return response.data;
  }

  async generateRecipe(data: RecipeGenerateRequest) {
    const response = await this.client.post<Recipe>('/recipes/generate', data);
    return response.data;
  }

  async getRecipe(recipeId: number) {
    const response = await this.client.get<Recipe>(`/recipes/${recipeId}`);
    return response.data;
  }

  async getMyRecipes(page = 1, pageSize = 20) {
    const response = await this.client.get<RecipeListResponse>('/recipes', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async getFavoriteRecipes(page = 1, pageSize = 20) {
    const response = await this.client.get<RecipeListResponse>('/recipes/favorites/list', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async searchRecipes(
    query?: string,
    cuisine?: string,
    difficulty?: string,
    minRating: number = 0,
    page = 1,
    pageSize = 20
  ) {
    const params: Record<string, string | number> = {
      page,
      page_size: pageSize,
    };

    if (query) params.q = query;
    if (cuisine) params.cuisine = cuisine;
    if (difficulty) params.difficulty = difficulty;
    if (minRating > 0) params.min_rating = minRating;

    const response = await this.client.get<RecipeListResponse>('/recipes/search/results', {
      params,
    });
    return response.data;
  }

  async getTrendingRecipes(minVerifications = 1, page = 1, pageSize = 20) {
    const response = await this.client.get<RecipeListResponse>('/recipes/trending/top', {
      params: {
        min_verifications: minVerifications,
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  }

  async toggleFavorite(recipeId: number) {
    const response = await this.client.post<ToggleFavoriteResponse>(`/recipes/${recipeId}/favorite`);
    return response.data;
  }

  async getRecipeVerifications(recipeId: number, page = 1, pageSize = 20) {
    const response = await this.client.get<VerificationListResponse>(`/verifications/recipe/${recipeId}`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async createVerification(data: VerificationCreate) {
    const response = await this.client.post<Verification>('/verifications/', data);
    return response.data;
  }

  async getCollections(page = 1, pageSize = 20) {
    const response = await this.client.get<CollectionListResponse>('/collections', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async createCollection(data: CollectionCreateRequest) {
    const response = await this.client.post<Collection>('/collections', data);
    return response.data;
  }

  async deleteCollection(collectionId: number) {
    await this.client.delete(`/collections/${collectionId}`);
  }

  async getCollection(collectionId: number, page = 1, pageSize = 50) {
    const response = await this.client.get<CollectionDetail>(`/collections/${collectionId}`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async addRecipeToCollection(collectionId: number, recipeId: number) {
    const response = await this.client.post<CollectionMutationResponse>(`/collections/${collectionId}/recipes`, {
      recipe_id: recipeId,
    });
    return response.data;
  }

  async removeRecipeFromCollection(collectionId: number, recipeId: number) {
    const response = await this.client.delete<CollectionMutationResponse>(
      `/collections/${collectionId}/recipes/${recipeId}`
    );
    return response.data;
  }
}

export const api = new ApiClient();
