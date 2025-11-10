/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'fire-1': 'fire 1.5s ease-in-out infinite',
        'fire-2': 'fire 1.2s ease-in-out infinite 0.2s',
        'fire-3': 'fire 1s ease-in-out infinite 0.4s',
        'smoke': 'smoke 3s ease-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        fire: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateY(-10px) scale(1.1)', opacity: '0.8' },
        },
        smoke: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'translateY(-100px) scale(1.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}