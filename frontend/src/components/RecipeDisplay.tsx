'use client';

import { useState } from 'react';
import { Recipe } from '@/lib/types';
import { Clock, Users, ChefHat, Heart, Star } from 'lucide-react';
import { api } from '@/lib/api';
import RecipeShare from './RecipeShare';

interface RecipeDisplayProps {
  recipe: Recipe;
  showActions?: boolean;
}

export default function RecipeDisplay({ recipe, showActions = true }: RecipeDisplayProps) {
  const [isFavorited, setIsFavorited] = useState(recipe.is_favorited);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  const handleToggleFavorite = async () => {
    setIsTogglingFavorite(true);
    try {
      const result = await api.toggleFavorite(recipe.id);
      setIsFavorited(result.is_favorited);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
            {recipe.description && (
              <p className="text-lg text-gray-600">{recipe.description}</p>
            )}
          </div>
          {showActions && (
            <div className="flex gap-2 ml-4">
              <RecipeShare recipe={recipe} />
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className={`p-3 rounded-full transition-colors ${
                  isFavorited
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm">
          {totalTime > 0 && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>{totalTime} mins total</span>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
          {recipe.difficulty && (
            <div className="flex items-center text-gray-600">
              <ChefHat className="w-4 h-4 mr-1" />
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
          )}
          {recipe.verified_count > 0 && (
            <div className="flex items-center text-gray-600">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              <span>{recipe.avg_rating.toFixed(1)} ({recipe.verified_count} reviews)</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {(recipe.cuisine_type || recipe.dietary_tags.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {recipe.cuisine_type && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {recipe.cuisine_type}
              </span>
            )}
            {recipe.dietary_tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Timing Breakdown */}
      {(recipe.prep_time_minutes || recipe.cook_time_minutes) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {recipe.prep_time_minutes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Prep Time</div>
              <div className="text-2xl font-bold text-gray-900">{recipe.prep_time_minutes} min</div>
            </div>
          )}
          {recipe.cook_time_minutes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Cook Time</div>
              <div className="text-2xl font-bold text-gray-900">{recipe.cook_time_minutes} min</div>
            </div>
          )}
        </div>
      )}

      {/* Equipment */}
      {recipe.equipment_needed.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Equipment Needed</h3>
          <ul className="grid grid-cols-2 gap-2">
            {recipe.equipment_needed.map((item, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ingredients */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start">
              <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2" />
              <span className="flex-1 text-gray-700">
                <span className="font-medium">
                  {ingredient.amount} {ingredient.unit}
                </span>{' '}
                {ingredient.item}
                {ingredient.notes && (
                  <span className="text-gray-500"> ({ingredient.notes})</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
        <ol className="space-y-4">
          {recipe.instructions.map((instruction) => (
            <li key={instruction.step} className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                {instruction.step}
              </span>
              <div className="flex-1 pt-1">
                <p className="text-gray-700">{instruction.instruction}</p>
                {instruction.time_minutes && (
                  <p className="text-sm text-gray-500 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {instruction.time_minutes} minutes
                  </p>
                )}
                {instruction.tip && (
                  <p className="text-sm text-primary-700 bg-primary-50 rounded px-3 py-2 mt-2">
                    💡 <strong>Tip:</strong> {instruction.tip}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Chef Notes */}
      {recipe.chef_notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Chef's Notes</h4>
          <p className="text-gray-700">{recipe.chef_notes}</p>
        </div>
      )}
    </div>
  );
}
