'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Recipe } from '@/lib/types';
import { ArrowLeft, Plus, Loader2, Trash2 } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';

interface Collection {
  id: number;
  name: string;
  description: string | null;
  color: string;
  recipes: Recipe[];
}

export default function CollectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = parseInt(params.id as string);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  const loadCollection = async () => {
    setIsLoading(true);
    try {
      const result = await api.getCollection(collectionId);
      setCollection(result);
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const result = await api.getMyRecipes();
      const notInCollection = result.recipes.filter(
        (recipe) => !collection?.recipes.some((r) => r.id === recipe.id)
      );
      setMyRecipes(notInCollection);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleAddRecipe = async (recipeId: number) => {
    try {
      await api.addRecipeToCollection(collectionId, recipeId);
      setShowAddRecipeModal(false);
      loadCollection();
      if (collection) {
        setMyRecipes(myRecipes.filter((r) => r.id !== recipeId));
      }
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const handleRemoveRecipe = async (recipeId: number) => {
    if (!confirm('Remove this recipe from the collection?')) return;

    try {
      await api.removeRecipeFromCollection(collectionId, recipeId);
      loadCollection();
    } catch (error) {
      console.error('Error removing recipe:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="card text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900">Collection not found</h3>
            <button onClick={() => router.back()} className="btn btn-primary mt-4">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                style={{ backgroundColor: collection.color + '20', color: collection.color }}
              >
                <div className="w-6 h-6 bg-current" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{collection.name}</h1>
              {collection.description && (
                <p className="text-gray-600 mt-1">{collection.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              loadMyRecipes();
              setShowAddRecipeModal(true);
            }}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Recipe</span>
          </button>
        </div>

        {/* Add Recipe Modal */}
        {showAddRecipeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Add Recipes</h2>
                <button
                  onClick={() => setShowAddRecipeModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {loadingRecipes ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                </div>
              ) : myRecipes.length > 0 ? (
                <div className="space-y-3">
                  {myRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{recipe.title}</h4>
                        <p className="text-sm text-gray-600">{recipe.description}</p>
                      </div>
                      <button
                        onClick={() => handleAddRecipe(recipe.id)}
                        className="btn btn-primary text-sm ml-4"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">
                  All your recipes are already in this collection
                </p>
              )}
            </div>
          </div>
        )}

        {/* Recipes Grid */}
        {collection.recipes.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              {collection.recipes.length} recipe{collection.recipes.length !== 1 ? 's' : ''} in
              this collection
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.recipes.map((recipe) => (
                <div key={recipe.id} className="relative group">
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => router.push(`/recipe/${recipe.id}`)}
                  />
                  <button
                    onClick={() => handleRemoveRecipe(recipe.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No recipes in this collection yet</p>
            <button
              onClick={() => {
                loadMyRecipes();
                setShowAddRecipeModal(true);
              }}
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Recipe</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
