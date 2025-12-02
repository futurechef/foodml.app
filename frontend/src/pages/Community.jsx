function Community() {
    const forks = [
        {
            id: 1,
            title: "Spicy Miso Ramen (Fork #42)",
            author: "RamenLover99",
            originalAuthor: "ChefKenji",
            description: "I tweaked the original recipe by adding extra chili oil and bamboo shoots. It's fire!",
            likes: 124,
            forks: 12,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKAsBCwh4nJvOa0oN803TLuKAAui5bGUiT2l_WCJFKH0ntk7bMrSI5HuVgVKsMmArxdatQnXgkt5PCtaA14DljhoxdiK8-xJnN3y_1LR5Qb1LOm7nrV2cZFf-s_HLpFqnYuTHRiT-XcUrbZ8nhPcgv5Jzq-BodTYQ4k8Hbh8U7HTgMcUewM5BN5j7Hb6zFJRttDhLjJAYdP67tRyKyiLqSDXkvmzZueaho5KkLtpZzjG6bgKk8nF6H9ZvL87RLGp12J2mEyvH6XQ"
        },
        {
            id: 2,
            title: "Grandma's Apple Pie (Gluten Free Fork)",
            author: "HealthyBaker",
            originalAuthor: "GrandmaBetty",
            description: "Swapped the flour for almond meal and it turned out surprisingly crispy.",
            likes: 89,
            forks: 5,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKAsBCwh4nJvOa0oN803TLuKAAui5bGUiT2l_WCJFKH0ntk7bMrSI5HuVgVKsMmArxdatQnXgkt5PCtaA14DljhoxdiK8-xJnN3y_1LR5Qb1LOm7nrV2cZFf-s_HLpFqnYuTHRiT-XcUrbZ8nhPcgv5Jzq-BodTYQ4k8Hbh8U7HTgMcUewM5BN5j7Hb6zFJRttDhLjJAYdP67tRyKyiLqSDXkvmzZueaho5KkLtpZzjG6bgKk8nF6H9ZvL87RLGp12J2mEyvH6XQ" // Using same placeholder for now
        },
        {
            id: 3,
            title: "Midnight Carbonara",
            author: "NightOwl",
            originalAuthor: "SpaghettiCarbonaraFan",
            description: "Added garlic confit because why not? A rich twist on the classic.",
            likes: 256,
            forks: 34,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKAsBCwh4nJvOa0oN803TLuKAAui5bGUiT2l_WCJFKH0ntk7bMrSI5HuVgVKsMmArxdatQnXgkt5PCtaA14DljhoxdiK8-xJnN3y_1LR5Qb1LOm7nrV2cZFf-s_HLpFqnYuTHRiT-XcUrbZ8nhPcgv5Jzq-BodTYQ4k8Hbh8U7HTgMcUewM5BN5j7Hb6zFJRttDhLjJAYdP67tRyKyiLqSDXkvmzZueaho5KkLtpZzjG6bgKk8nF6H9ZvL87RLGp12J2mEyvH6XQ"
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="font-heading text-5xl font-bold text-secondary mb-4">Community Forks</h1>
                <p className="text-text-dark-cocoa text-xl">See how recipes are evolving in real-time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {forks.map((fork) => (
                    <div key={fork.id} className="bg-white rounded-xl border-2 border-secondary/10 shadow-retro hover:shadow-retro-sm transition-all overflow-hidden flex flex-col">
                        <div className="h-48 bg-cover bg-center border-b-2 border-secondary/10" style={{ backgroundImage: `url(${fork.image})` }}></div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs font-mono text-secondary/60 mb-2">
                                <span className="material-symbols-outlined text-sm">call_split</span>
                                <span>Forked from {fork.originalAuthor}</span>
                            </div>
                            <h3 className="font-heading text-2xl font-bold text-secondary mb-2">{fork.title}</h3>
                            <p className="text-text-dark-cocoa/80 text-sm mb-4 flex-grow">{fork.description}</p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary/10">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-full bg-primary/20"></div>
                                    <span className="text-sm font-bold text-text-espresso">{fork.author}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-secondary">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">favorite</span> {fork.likes}</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">call_split</span> {fork.forks}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Community
