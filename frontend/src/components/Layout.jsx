import { Outlet, Link, useLocation } from 'react-router-dom'

function Layout() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "bg-primary/20 text-secondary" : "text-secondary/70 hover:text-secondary hover:bg-primary/10";
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-body bg-background text-text-dark-cocoa">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-secondary/20 bg-background/95 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-3">
                <Link to="/" className="flex items-center gap-4 text-secondary group">
                    <div className="size-6 text-accent group-hover:scale-110 transition-transform">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_6_319)">
                                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                            </g>
                            <defs>
                                <clipPath id="clip0_6_319"><rect fill="white" height="48" width="48"></rect></clipPath>
                            </defs>
                        </svg>
                    </div>
                    <h2 className="font-heading text-2xl font-bold leading-tight">ForkRecipes.com</h2>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link to="/" className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${isActive('/')}`}>Home</Link>
                    <Link to="/create" className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${isActive('/create')}`}>Create</Link>
                    <Link to="/community" className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${isActive('/community')}`}>Community</Link>
                    <Link to="/about" className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${isActive('/about')}`}>About</Link>
                </nav>

                <div className="hidden sm:flex items-center gap-2">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-secondary/20" data-alt="User avatar image" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYJ2sOuny-zl4ijhmHAuDjJM4hrWAAZ_fO9Ie4ZjT28pOpt_qGQDh4damHUPb6X8r_Zj98YcReuVl931w_xHAPT7K9sxVZEs5bqlcT3EWjoGlyaTKCFvGLKumdjGy3olxPejPrhMfQsRp_QE8uYg6U0MltuTxOlXdFogG2UeY6V4NKyZ0bYID_9EqGc2vYcjd0v8l_9zEzbxPNYab-iEFq5pXAjnB7f3DrdHMsRePYizF2TdPTJc5JwHO2sFzopK65xVcstWMyBg")' }}></div>
                </div>
            </header>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="border-t border-secondary/20 bg-background py-8 mt-auto">
                <div className="max-w-6xl mx-auto px-4 text-center text-text-dark-cocoa/60 text-sm">
                    <p>&copy; {new Date().getFullYear()} ForkRecipes.com. All rights reserved.</p>
                    <p className="mt-2 font-mono text-xs">Built for the Community.</p>
                </div>
            </footer>
        </div>
    )
}

export default Layout
