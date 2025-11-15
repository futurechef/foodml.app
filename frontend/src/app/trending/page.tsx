'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Recipe } from '@/lib/types';
import { TrendingUp, Loader2, ChefHat } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';

export default function TrendingPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(12);

  useEffect(() => {
    loadTrendingRecipes();
  }, [page]);

  const loadTrendingRecipes = async () => {
    setIsLoading(true);
    try {
      const result = await api.getTrendingRecipes(1, page, pageSize);
      setRecipes(result.recipes);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading trending recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-primary-600" />
            <span>Trending Recipes</span>
          </h1>
          <p className="text-gray-600">Most popular and highly-rated recipes from our community</p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{recipes.length}</span> of{' '}
                <span className="font-semibold">{total}</span> verified recipes
              </p>
            </div>

            {/* Recipe Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => router.push(`/recipe/${recipe.id}`)}
                  showVerifications={true}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-12">
            <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No verified recipes yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to verify a recipe and see it here!
            </p>
            <button
              onClick={() => router.push('/my-recipes')}
              className="btn btn-primary"
            >
              View My Recipes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
