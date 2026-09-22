/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sih: {
          bg: '#0b132b',
          card: '#1c2541',
          cardBorder: '#3a506b',
          accent: '#f59e0b', // Amber 500
          emerald: '#10b981',
          indigo: '#6366f1',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      }
    },
  },
  plugins: [],
}
