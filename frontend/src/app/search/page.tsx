'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Recipe, RecipeListResponse } from '@/lib/types';
import { Search, Loader2, ChefHat } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [minRating, setMinRating] = useState(searchParams.get('min_rating') ? parseFloat(searchParams.get('min_rating')!) : 0);
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize] = useState(12);

  useEffect(() => {
    if (searchQuery || cuisine || difficulty || minRating > 0) {
      performSearch();
    }
  }, [page]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const result = await api.searchRecipes(
        searchQuery || undefined,
        cuisine || undefined,
        difficulty || undefined,
        minRating || undefined,
        page,
        pageSize
      );
      setRecipes(result.recipes);
      setTotal(result.total);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (cuisine) params.append('cuisine', cuisine);
    if (difficulty) params.append('difficulty', difficulty);
    if (minRating > 0) params.append('min_rating', minRating.toString());
    
    router.push(`/search?${params.toString()}`);
    performSearch();
  };

  const hasFilters = searchQuery || cuisine || difficulty || minRating > 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
            <Search className="w-8 h-8 text-primary-600" />
            <span>Search Recipes</span>
          </h1>
          <p className="text-gray-600">Find recipes by title, cuisine, difficulty, or rating</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="card mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Search Query */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Name or Description
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                placeholder="Search by title or description..."
              />
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="input"
              >
                <option value="">All Cuisines</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Asian">Asian</option>
                <option value="Indian">Indian</option>
                <option value="Thai">Thai</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="French">French</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="American">American</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating: {minRating.toFixed(1)} ⭐
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search</span>
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {hasFilters ? (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : recipes.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found <span className="font-semibold">{total}</span> recipe{total !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Recipe Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={() => router.push(`/recipe/${recipe.id}`)}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">
                  Try adjusting your search filters or browse trending recipes instead.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Searching</h3>
            <p className="text-gray-600">
              Enter search terms and filters above to find recipes that match your preferences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
