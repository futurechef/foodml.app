'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ChefHat, Sparkles, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(api.isAuthenticated());
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/generate');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">FoodML Recipe Lab</h1>
            </div>
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => router.push('/generate')}
                    className="btn btn-primary"
                  >
                    Generate Recipe
                  </button>
                  <button
                    onClick={() => router.push('/search')}
                    className="btn btn-secondary"
                  >
                    Search Recipes
                  </button>
                  <button
                    onClick={() => router.push('/trending')}
                    className="btn btn-secondary"
                  >
                    Trending
                  </button>
                  <button
                    onClick={() => router.push('/collections')}
                    className="btn btn-secondary"
                  >
                    Collections
                  </button>
                  <button
                    onClick={() => router.push('/my-recipes')}
                    className="btn btn-secondary"
                  >
                    My Recipes
                  </button>
                  <button
                    onClick={() => api.logout()}
                    className="btn btn-outline"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="btn btn-secondary"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="btn btn-primary"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-custom py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Turn Your Cravings into{' '}
            <span className="text-primary-600">Perfect Recipes</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered recipe generation that understands your needs. Get personalized recipes
            in seconds, then help us verify what works in real kitchens.
          </p>
          <button
            onClick={handleGetStarted}
            className="btn btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Creating Recipes</span>
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Describe Your Dish</h4>
              <p className="text-gray-600">
                Tell us what you want to cook - cuisine, dietary needs, ingredients, or just a craving
              </p>
            </div>
            <div className="card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 text-secondary-600 rounded-full mb-4">
                <ChefHat className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Get Expert Recipes</h4>
              <p className="text-gray-600">
                AI generates detailed, culinary-sound recipes with precise measurements and techniques
              </p>
            </div>
            <div className="card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Verify & Share</h4>
              <p className="text-gray-600">
                Cook it, rate it, share feedback - help build the world's best AI recipe database
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-20">
        <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Cook Something Amazing?</h3>
          <p className="text-lg mb-8 text-primary-100">
            Join thousands of home cooks discovering perfect recipes every day
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-primary-600 hover:bg-gray-100 btn text-lg px-8 py-4"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container-custom text-center">
          <p>&copy; 2025 FoodML Recipe Lab. AI-powered culinary innovation.</p>
        </div>
      </footer>
    </div>
  );
}
