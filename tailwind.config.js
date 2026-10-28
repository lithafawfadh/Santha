/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'luxury-bg': '#020617',
        'luxury-surface': '#0B1120',
        'luxury-card': 'rgba(25, 25, 25, 0.6)',
        'luxury-card-hover': 'rgba(35, 35, 35, 0.8)',
        brutal: {
          yellow: '#FFE600',
          yellowLight: '#FFF275',
          coral: '#FF6B6B',
          pink: '#FF8A8A',
          teal: '#48CAE4',
          mint: '#06D6A0',
          canvas: '#F8F9FA',
          surface: '#FFFFFF',
          ink: '#000000',
          muted: '#71717A',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F2CA50',
          dark: '#AA8822',
          glow: 'rgba(212, 175, 55, 0.3)',
        },
        emerald: {
          DEFAULT: '#10B981',
          glow: '#059669',
        },
        'ghost-border': 'rgba(212, 175, 55, 0.15)',
      },
      fontFamily: {
        serif: ['"Noto Serif"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'ambient': '0 20px 50px rgba(0, 0, 0, 0.5)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.2)',
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.2)',
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-md': '3px 3px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-xl': '8px 8px 0px 0px #000000',
        'brutal-yellow': '4px 4px 0px 0px #FFE600',
      },
      backdropBlur: {
        'luxury': '24px',
      }
    },
  },
  plugins: [],
};
