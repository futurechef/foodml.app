import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="flex flex-col items-center text-center gap-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold border border-accent/20">
                    <span className="material-symbols-outlined text-base">call_split</span>
                    <span>Great Recipes Evolve</span>
                </div>

                <h1 className="font-heading text-6xl sm:text-8xl font-bold text-secondary leading-tight">
                    Fork. Cook. <br />
                    <span className="text-accent">Share.</span>
                </h1>

                <p className="text-text-dark-cocoa text-xl sm:text-2xl font-normal leading-relaxed max-w-2xl">
                    Recipes aren't static rules. They are living ideas. Join the community where we take great dishes, tweak them, and share the evolution.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Link to="/create" className="flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-text-parchment text-lg font-bold rounded-lg shadow-retro hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                        <span className="material-symbols-outlined">edit_note</span>
                        Draft a Recipe
                    </Link>
                    <Link to="/community" className="flex items-center justify-center gap-2 px-8 py-4 bg-primary/20 text-secondary text-lg font-bold rounded-lg hover:bg-primary/30 transition-all">
                        Explore Forks
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
                    <div className="p-6 bg-white rounded-xl border-2 border-secondary/10 shadow-sm hover:shadow-retro-sm transition-all">
                        <span className="material-symbols-outlined text-4xl text-accent mb-4">history_edu</span>
                        <h3 className="font-heading text-2xl font-bold text-secondary mb-2">Recipe History</h3>
                        <p className="text-text-dark-cocoa/80">Track how a dish has changed over time. See the lineage of your favorite meals.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border-2 border-secondary/10 shadow-sm hover:shadow-retro-sm transition-all">
                        <span className="material-symbols-outlined text-4xl text-pop mb-4">psychology</span>
                        <h3 className="font-heading text-2xl font-bold text-secondary mb-2">Brain Dump</h3>
                        <p className="text-text-dark-cocoa/80">Got an idea? Dump your thoughts and let our smart formatter structure it for you.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border-2 border-secondary/10 shadow-sm hover:shadow-retro-sm transition-all">
                        <span className="material-symbols-outlined text-4xl text-primary mb-4">groups</span>
                        <h3 className="font-heading text-2xl font-bold text-secondary mb-2">Community</h3>
                        <p className="text-text-dark-cocoa/80">Share your forks, discuss techniques, and recommend products.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
