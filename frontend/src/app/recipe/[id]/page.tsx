'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Recipe, VerificationListResponse } from '@/lib/types';
import RecipeDisplay from '@/components/RecipeDisplay';
import VerificationForm from '@/components/VerificationForm';
import { ChefHat, ArrowLeft, Star, MessageSquare, Loader2 } from 'lucide-react';

export default function RecipePage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = parseInt(params.id as string);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [verifications, setVerifications] = useState<VerificationListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipe = async () => {
    try {
      setIsLoading(true);
      const [recipeData, verificationsData] = await Promise.all([
        api.getRecipe(recipeId),
        api.getRecipeVerifications(recipeId),
      ]);
      setRecipe(recipeData);
      setVerifications(verificationsData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load recipe');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadRecipe();
  }, [recipeId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Recipe not found'}</p>
          <button onClick={() => router.push('/')} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-2">
                <ChefHat className="w-6 h-6 text-primary-600" />
                <h1 className="text-xl font-bold text-gray-900">FoodML Recipe Lab</h1>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/generate')}
                className="btn btn-secondary"
              >
                Generate Recipe
              </button>
              <button
                onClick={() => router.push('/my-recipes')}
                className="btn btn-secondary"
              >
                My Recipes
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container-custom py-12 space-y-8">
        <RecipeDisplay recipe={recipe} />

        {/* Verification Form */}
        <VerificationForm
          recipeId={recipeId}
          onVerificationSubmitted={loadRecipe}
        />

        {/* Verifications List */}
        {verifications && verifications.verifications.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                Community Reviews ({verifications.total})
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold">{verifications.avg_rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">average</span>
                </div>
                <div>
                  <span className="font-semibold">{verifications.success_rate.toFixed(0)}%</span>
                  <span className="text-gray-500 ml-1">success rate</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {verifications.verifications.map((verification) => (
                <div
                  key={verification.id}
                  className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= verification.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          verification.success
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {verification.success ? 'Worked' : 'Had issues'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(verification.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {verification.execution_time_minutes && (
                    <p className="text-sm text-gray-600 mb-2">
                      Actual time: {verification.execution_time_minutes} minutes
                    </p>
                  )}

                  {verification.feedback_text && (
                    <p className="text-gray-700">{verification.feedback_text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
