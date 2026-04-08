/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'luxury-bg': '#121212',
        'luxury-surface': '#1c1b1b',
        'luxury-card': '#201f1f',
        'luxury-card-hover': '#2a2a2a',
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F2CA50',
        },
        'luxury-emerald': '#50C878',
        'ghost-border': '#4D4635',
      },
      fontFamily: {
        serif: ['"Noto Serif"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'ambient': '0 -5px 40px 6px rgba(14, 14, 14, 0.06)',
      }
    },
  },
  plugins: [],
};
