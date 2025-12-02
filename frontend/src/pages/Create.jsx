import { useState } from 'react'

function Create() {
    const [ingredients, setIngredients] = useState('')
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setRecipe(null)

        try {
            // We still use the same backend endpoint for now, but the UI framing is different
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/generate-recipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients }),
            })

            if (!response.ok) {
                throw new Error('Failed to format recipe')
            }

            const data = await response.json()
            setRecipe(data)
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to format recipe. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Input Section */}
            {!recipe && (
                <div className="flex flex-col gap-8 items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                        <h1 className="font-heading text-6xl font-bold text-accent">Brain Dump</h1>
                        <p className="text-text-dark-cocoa text-xl font-normal leading-relaxed max-w-2xl">
                            Got a rough idea? Throw your ingredients and thoughts here. We'll format it into a beautiful recipe card for you to tweak and share.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl bg-primary/10 p-8 rounded-lg border-2 border-secondary/30 shadow-retro">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="ingredients" className="block text-lg font-bold text-secondary mb-2">
                                    Your Notes & Ingredients
                                </label>
                                <textarea
                                    id="ingredients"
                                    name="ingredients"
                                    rows={6}
                                    className="w-full bg-background border-2 border-secondary/20 rounded-md p-4 text-text-espresso placeholder-text-dark-cocoa/50 focus:border-accent focus:ring-0 font-mono text-lg shadow-inner"
                                    placeholder="e.g. I have some leftover chicken and rice, maybe something with soy sauce? I also have broccoli that needs using."
                                    value={ingredients}
                                    onChange={(e) => setIngredients(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center py-4 px-6 border-2 border-secondary rounded-md shadow-retro text-lg font-bold text-text-parchment bg-accent hover:bg-accent/90 focus:outline-none transition-all duration-200 ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                        Formatting...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <span className="material-symbols-outlined">edit_note</span>
                                        Draft Recipe
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Result Section */}
            {recipe && (
                <div className="layout-content-container flex flex-col gap-6 animate-fade-in">
                    {/* Breadcrumbs */}
                    <div className="flex flex-wrap gap-2 font-mono text-sm">
                        <span className="text-secondary/80">ForkRecipes.com</span>
                        <span className="text-secondary/60">/</span>
                        <span className="text-secondary/80">Drafts</span>
                        <span className="text-secondary/60">/</span>
                        <span className="text-text-espresso font-bold">{recipe.title}</span>
                    </div>

                    {/* Title Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <h1 className="font-heading text-6xl font-bold text-accent">{recipe.title}</h1>
                            <p className="text-text-dark-cocoa text-base font-normal leading-relaxed max-w-2xl">
                                A structured draft based on your notes. Ready for you to refine.
                            </p>
                        </div>
                        <div className="flex flex-none gap-2 flex-wrap justify-start">
                            <button onClick={() => setRecipe(null)} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-primary/20 hover:bg-primary/30 text-secondary text-sm font-bold leading-normal gap-2 transition-shadow hover:shadow-retro-sm">
                                <span className="material-symbols-outlined text-base">arrow_back</span>
                                <span className="truncate">New Draft</span>
                            </button>
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-pop text-text-parchment text-sm font-bold leading-normal gap-2 transition-shadow hover:shadow-retro-sm">
                                <span className="material-symbols-outlined text-base">publish</span>
                                <span className="truncate">Publish Fork</span>
                            </button>
                        </div>
                    </div>

                    {/* View Toggle (Visual Only) */}
                    <div className="flex w-full sm:w-auto">
                        <div className="flex h-10 w-full sm:w-72 items-center justify-center rounded-lg bg-primary/20 p-1">
                            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded px-2 bg-background shadow-retro-sm text-text-espresso text-sm font-bold">
                                <span className="truncate">Cook View</span>
                                <input defaultChecked className="invisible w-0" name="view-toggle" type="radio" value="Cook View" />
                            </label>
                            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded px-2 text-secondary text-sm font-bold hover:bg-background/50">
                                <span className="truncate">Code View</span>
                                <input className="invisible w-0" name="view-toggle" type="radio" value="Code View" />
                            </label>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            {/* Hero Image */}
                            <div className="w-full aspect-video rounded-lg border-2 border-secondary bg-cover bg-center shadow-retro" data-alt="Recipe Image" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCKAsBCwh4nJvOa0oN803TLuKAAui5bGUiT2l_WCJFKH0ntk7bMrSI5HuVgVKsMmArxdatQnXgkt5PCtaA14DljhoxdiK8-xJnN3y_1LR5Qb1LOm7nrV2cZFf-s_HLpFqnYuTHRiT-XcUrbZ8nhPcgv5Jzq-BodTYQ4k8Hbh8U7HTgMcUewM5BN5j7Hb6zFJRttDhLjJAYdP67tRyKyiLqSDXkvmzZueaho5KkLtpZzjG6bgKk8nF6H9ZvL87RLGp12J2mEyvH6XQ")' }}></div>

                            {/* Ingredients */}
                            <div className="flex flex-col gap-4">
                                <h3 className="font-heading text-4xl font-bold text-secondary">Ingredients.md</h3>
                                <div className="bg-primary/10 p-6 rounded-lg border-2 border-secondary/30 shadow-retro">
                                    <ul className="space-y-3 font-body">
                                        {recipe.ingredients.map((item, index) => (
                                            <li key={index} className="flex items-baseline gap-3 text-text-dark-cocoa">
                                                <span className="material-symbols-outlined text-accent text-sm">check_circle</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-heading text-4xl font-bold text-secondary">README.md</h3>
                                    <button className="flex items-center gap-2 text-secondary/80 hover:text-secondary text-sm font-bold">
                                        <span className="material-symbols-outlined text-base">content_copy</span>
                                        <span>Copy</span>
                                    </button>
                                </div>
                                <div className="space-y-6 text-text-dark-cocoa leading-relaxed">
                                    {recipe.instructions.map((step, index) => (
                                        <div key={index}>
                                            <h4 className="font-bold text-lg text-text-espresso mb-2">Step {index + 1}</h4>
                                            <p>{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            {/* Metadata */}
                            <div className="p-6 bg-primary/10 rounded-lg border-2 border-secondary/30 shadow-retro">
                                <h4 className="font-heading text-2xl font-bold text-accent mb-4">Metadata</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                                    <div className="flex items-center gap-2 text-text-dark-cocoa"><span className="material-symbols-outlined text-lg text-accent">timer</span><span>Prep: 15m</span></div>
                                    <div className="flex items-center gap-2 text-text-dark-cocoa"><span className="material-symbols-outlined text-lg text-accent">skillet</span><span>Cook: 20m</span></div>
                                    <div className="flex items-center gap-2 text-text-dark-cocoa"><span className="material-symbols-outlined text-lg text-accent">restaurant</span><span>Serves: 2</span></div>
                                    <div className="flex items-center gap-2 text-text-dark-cocoa"><span className="material-symbols-outlined text-lg text-accent">signal_cellular_alt</span><span>Medium</span></div>
                                </div>
                            </div>

                            {/* Taste Profile */}
                            <div className="p-6 bg-primary/10 rounded-lg border-2 border-secondary/30 shadow-retro">
                                <h4 className="font-heading text-2xl font-bold text-accent mb-4">Taste Profile</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="w-16 flex-none text-text-dark-cocoa">Savory</span>
                                        <div className="w-full bg-secondary/20 rounded-full h-2"><div className="bg-accent h-2 rounded-full" style={{ width: '85%' }}></div></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-16 flex-none text-text-dark-cocoa">Salty</span>
                                        <div className="w-full bg-secondary/20 rounded-full h-2"><div className="bg-accent h-2 rounded-full" style={{ width: '60%' }}></div></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-16 flex-none text-text-dark-cocoa">Richness</span>
                                        <div className="w-full bg-secondary/20 rounded-full h-2"><div className="bg-accent h-2 rounded-full" style={{ width: '75%' }}></div></div>
                                    </div>
                                </div>
                            </div>

                            {/* Author */}
                            <div className="p-6 bg-primary/10 rounded-lg border-2 border-secondary/30 shadow-retro">
                                <h4 className="font-heading text-2xl font-bold text-accent mb-4">About Author</h4>
                                <div className="flex items-center gap-4">
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" data-alt="Author's avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYJ2sOuny-zl4ijhmHAuDjJM4hrWAAZ_fO9Ie4ZjT28pOpt_qGQDh4damHUPb6X8r_Zj98YcReuVl931w_xHAPT7K9sxVZEs5bqlcT3EWjoGlyaTKCFvGLKumdjGy3olxPejPrhMfQsRp_QE8uYg6U0MltuTxOlXdFogG2UeY6V4NKyZ0bYID_9EqGc2vYcjd0v8l_9zEzbxPNYab-iEFq5pXAjnB7f3DrdHMsRePYizF2TdPTJc5JwHO2sFzopK65xVcstWMyBg")' }}></div>
                                    <div>
                                        <p className="font-bold text-text-espresso">You</p>
                                        <p className="text-sm text-text-dark-cocoa">Drafting a new creation.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Create
