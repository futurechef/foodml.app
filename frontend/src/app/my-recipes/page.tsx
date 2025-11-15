'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { RecipeListResponse } from '@/lib/types';
import RecipeCard from '@/components/RecipeCard';
import { ChefHat, ArrowLeft, Loader2 } from 'lucide-react';

export default function MyRecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecipeListResponse | null>(null);
  const [favorites, setFavorites] = useState<RecipeListResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadRecipes = async () => {
      try {
        setIsLoading(true);
        const [allRecipes, favoriteRecipes] = await Promise.all([
          api.getMyRecipes(),
          api.getFavoriteRecipes(),
        ]);
        setRecipes(allRecipes);
        setFavorites(favoriteRecipes);
      } catch (error) {
        console.error('Failed to load recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, [router]);

  const currentRecipes = activeTab === 'all' ? recipes : favorites;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Home</span>
              </button>
              <div className="flex items-center space-x-2">
                <ChefHat className="w-6 h-6 text-primary-600" />
                <h1 className="text-xl font-bold text-gray-900">FoodML Recipe Lab</h1>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/generate')}
                className="btn btn-primary"
              >
                Generate Recipe
              </button>
              <button onClick={() => api.logout()} className="btn btn-outline">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container-custom py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Recipes</h2>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Recipes ({recipes?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Favorites ({favorites?.total || 0})
          </button>
        </div>

        {/* Recipes Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : currentRecipes && currentRecipes.recipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRecipes.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {activeTab === 'all'
                ? "You haven't generated any recipes yet."
                : "You haven't favorited any recipes yet."}
            </p>
            {activeTab === 'all' && (
              <button
                onClick={() => router.push('/generate')}
                className="btn btn-primary"
              >
                Generate Your First Recipe
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
