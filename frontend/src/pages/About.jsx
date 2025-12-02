function About() {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 sm:p-12 rounded-2xl border-2 border-secondary/10 shadow-retro">
                <h1 className="font-heading text-5xl font-bold text-secondary mb-8">The ForkRecipes Manifesto</h1>

                <div className="space-y-6 text-lg text-text-dark-cocoa leading-relaxed font-body">
                    <p>
                        <strong className="text-accent">We believe recipes are living documents.</strong>
                    </p>

                    <p>
                        In software, when you want to take a project and make it your own, you "fork" it. You respect the original history, but you add your own DNA. Why should cooking be any different?
                    </p>

                    <p>
                        Traditional cookbooks treat recipes as static laws. "Do exactly this." But that's not how great food happens. Great food happens when you realize you're out of thyme and use oregano instead. It happens when you add a splash of soy sauce to your bolognese because you like the umami.
                    </p>

                    <h2 className="font-heading text-3xl font-bold text-secondary mt-8 pt-4 border-t border-secondary/10">Our Mission</h2>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Preserve History:</strong> We track where a recipe came from.</li>
                        <li><strong>Encourage Evolution:</strong> We want you to tweak, change, and improve dishes.</li>
                        <li><strong>Smart Formatting:</strong> We use technology to help you structure your messy thoughts into beautiful, shareable cards.</li>
                    </ul>

                    <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-sm font-mono text-secondary">
                            <strong>Join us.</strong> Fork a recipe. Add your DNA. Share it with the world.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
