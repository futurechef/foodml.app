'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { Recipe, RecipeGenerateRequest } from '@/lib/types';
import { Loader2, Sparkles } from 'lucide-react';

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: Recipe) => void;
}

export default function RecipeGenerator({ onRecipeGenerated }: RecipeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RecipeGenerateRequest>({
    defaultValues: {
      servings: 4,
      dietary_restrictions: [],
    },
  });

  const onSubmit = async (data: RecipeGenerateRequest) => {
    setIsGenerating(true);
    setError(null);

    try {
      const recipe = await api.generateRecipe(data);
      onRecipeGenerated(recipe);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate recipe. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold">Generate Your Recipe</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to cook?
          </label>
          <textarea
            {...register('prompt', {
              required: 'Please describe what you want to cook',
              minLength: { value: 5, message: 'Please provide more details' },
              maxLength: { value: 500, message: 'Description is too long' }
            })}
            className="input min-h-[120px]"
            placeholder="E.g., Easy weeknight pasta with pantry staples, Healthy vegetarian lunch bowl, Quick breakfast for busy mornings..."
            disabled={isGenerating}
          />
          {errors.prompt && (
            <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>
          )}
        </div>

        {/* Servings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Servings
          </label>
          <input
            type="number"
            {...register('servings', { min: 1, max: 12 })}
            className="input"
            min="1"
            max="12"
            disabled={isGenerating}
          />
        </div>

        {/* Cuisine Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cuisine Type (Optional)
          </label>
          <input
            type="text"
            {...register('cuisine_type')}
            className="input"
            placeholder="E.g., Italian, Mexican, Thai, Indian..."
            disabled={isGenerating}
          />
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Restrictions (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'].map((tag) => (
              <label key={tag} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={tag}
                  {...register('dietary_restrictions')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  disabled={isGenerating}
                />
                <span className="text-sm capitalize">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full btn btn-primary flex items-center justify-center space-x-2 py-3"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Recipe...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Recipe</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
