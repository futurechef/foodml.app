import { useState } from 'react'

function App() {
  const [ingredients, setIngredients] = useState('')
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setRecipe(null)

    try {
      const response = await fetch('http://localhost:8000/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate recipe')
      }

      const data = await response.json()
      setRecipe(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate recipe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            FoodML Recipe Lab
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Turn your ingredients into culinary masterpieces with AI.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-300">
                Enter Ingredients (comma separated)
              </label>
              <div className="mt-1">
                <textarea
                  id="ingredients"
                  name="ingredients"
                  rows={4}
                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 bg-gray-700 rounded-md text-white placeholder-gray-400 p-3"
                  placeholder="e.g. chicken, rice, broccoli, soy sauce"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ${loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Magic...
                  </span>
                ) : (
                  'Generate Recipe'
                )}
              </button>
            </div>
          </form>
        </div>

        {recipe && (
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
              {recipe.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-3">Ingredients</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {recipe.ingredients.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-pink-400 mb-3">Instructions</h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  {recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
