/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AgriSathi Brand Palette
        'forest-green': '#1E5E3A',
        'forest-green-dark': '#164d30',
        'forest-green-light': '#2d7a50',
        'earth': '#795548',
        'earth-light': '#a1887f',
        'harvest-gold': '#D97706',
        'harvest-gold-light': '#f59e0b',
        'safety-red': '#DC2626',
        'safety-red-light': '#ef4444',
        'sky-blue': '#0EA5E9',
        'leaf-green': '#22C55E',
        'soil-brown': '#92400E',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Telugu', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.10)',
        'bottom-nav': '0 -2px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
