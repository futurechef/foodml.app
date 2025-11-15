'use client';

import { Recipe } from '@/lib/types';
import { Clock, Users, Star, Heart, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  showVerifications?: boolean;
}

export default function RecipeCard({ recipe, onClick, showVerifications = false }: RecipeCardProps) {
  const router = useRouter();
  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/recipe/${recipe.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="card hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 flex-1">
          {recipe.title}
        </h3>
        {recipe.is_favorited && (
          <Heart className="w-5 h-5 text-red-600 fill-current flex-shrink-0 ml-2" />
        )}
      </div>

      {recipe.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
        {totalTime > 0 && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{totalTime}m</span>
          </div>
        )}
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          <span>{recipe.servings}</span>
        </div>
        {recipe.verified_count > 0 && (
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
            <span>{recipe.avg_rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Verification Badge */}
      {showVerifications && recipe.verified_count > 0 && (
        <div className="flex items-center text-green-700 text-sm mb-3 bg-green-50 px-3 py-2 rounded">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>{recipe.verified_count} verified by community</span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {recipe.cuisine_type && (
          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
            {recipe.cuisine_type}
          </span>
        )}
        {recipe.difficulty && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">
            {recipe.difficulty}
          </span>
        )}
        {recipe.dietary_tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium capitalize"
          >
            {tag}
          </span>
        ))}
        {recipe.dietary_tags.length > 2 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
            +{recipe.dietary_tags.length - 2}
          </span>
        )}
      </div>
    </div>
  );
}
