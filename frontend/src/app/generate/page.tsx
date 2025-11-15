'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Recipe } from '@/lib/types';
import RecipeGenerator from '@/components/RecipeGenerator';
import RecipeDisplay from '@/components/RecipeDisplay';
import { ChefHat, ArrowLeft } from 'lucide-react';

export default function GeneratePage() {
  const router = useRouter();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

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
                onClick={() => router.push('/my-recipes')}
                className="btn btn-secondary"
              >
                My Recipes
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
        {!generatedRecipe ? (
          <RecipeGenerator onRecipeGenerated={setGeneratedRecipe} />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Generated Recipe</h2>
              <button
                onClick={() => setGeneratedRecipe(null)}
                className="btn btn-primary"
              >
                Generate Another Recipe
              </button>
            </div>
            <RecipeDisplay recipe={generatedRecipe} />
          </div>
        )}
      </div>
    </div>
  );
}
