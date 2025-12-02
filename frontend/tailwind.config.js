/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#C89968",
                "secondary": "#6B3410",
                "accent": "#3A7080",
                "pop": "#D14961",
                "background": "#FDFBF7",
                "text-espresso": "#331E14",
                "text-dark-cocoa": "#54392A",
                "text-parchment": "#FDFBF7"
            },
            fontFamily: {
                "heading": ["Caveat", "cursive"],
                "body": ["Inter", "sans-serif"],
                "mono": ["JetBrains Mono", "monospace"]
            },
            boxShadow: {
                'retro': '4px 4px 0px 0px rgba(0,0,0,0.75)',
                'retro-sm': '2px 2px 0px 0px rgba(0,0,0,0.75)',
            },
        },
    },
    plugins: [],
}
