'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Folder, Plus, Loader2 } from 'lucide-react';

interface Collection {
  id: number;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

interface CollectionListResponse {
  collections: Collection[];
  total: number;
  page: number;
  page_size: number;
}

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [newCollectionColor, setNewCollectionColor] = useState('#3B82F6');

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    setIsLoading(true);
    try {
      const result = await api.getCollections();
      setCollections(result.collections);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      await api.createCollection({
        name: newCollectionName,
        description: newCollectionDescription || null,
        color: newCollectionColor,
      });
      setNewCollectionName('');
      setNewCollectionDescription('');
      setNewCollectionColor('#3B82F6');
      setShowCreateModal(false);
      loadCollections();
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleDeleteCollection = async (collectionId: number) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      await api.deleteCollection(collectionId);
      loadCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center space-x-2">
              <Folder className="w-8 h-8 text-primary-600" />
              <span>My Collections</span>
            </h1>
            <p className="text-gray-600 mt-2">Organize your recipes into custom cookbooks</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Collection</span>
          </button>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="card max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create Collection</h2>
              <form onSubmit={handleCreateCollection}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="input"
                    placeholder="e.g., Quick Weeknight Dinners"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                    className="input min-h-[80px]"
                    placeholder="Optional description..."
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCollectionColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          newCollectionColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Collections List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : collections.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="card hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: collection.color + '20', color: collection.color }}
                >
                  <Folder className="w-6 h-6" />
                </div>
                <h3
                  className="text-lg font-semibold mb-2 cursor-pointer hover:text-primary-600"
                  onClick={() => router.push(`/collections/${collection.id}`)}
                >
                  {collection.name}
                </h3>
                {collection.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <button
                    onClick={() => router.push(`/collections/${collection.id}`)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Recipes →
                  </button>
                  <button
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections yet</h3>
            <p className="text-gray-600 mb-4">Create your first collection to organize recipes</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Collection</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
