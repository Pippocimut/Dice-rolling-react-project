const config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'media', // Uses the prefers-color-scheme media query
    theme: {
        extend: {
            colors: {
                'jet': 'var(--jet)',
                'duke-blue': 'var(--duke-blue)',
                'true-blue': 'var(--true-blue)',
                'powder-blue': 'var(--powder-blue)',
                'ivory': 'var(--ivory)',
                'dark-jet': 'var(--dark-jet)',

                // Theme-specific colors
                'background': 'var(--background-color)',
                'text': 'var(--text-color)',
                'primary': 'var(--primary-color)',
            },
        },
    },
    plugins: [],
}

export default config
