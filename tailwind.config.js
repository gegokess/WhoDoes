/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dusk Palette
        darkest: '#260907',
        burgundy: '#6E363C',
        terracotta: '#A45F48',
        slate: '#97A4AD',
        'light-slate': '#CAD3DD',
        beige: '#E5E6E0',
        
        // Functional Colors
        primary: {
          DEFAULT: '#A45F48',
          dark: '#8B4A36',
          light: '#D4A89A',
        },
        background: '#E5E6E0',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F5F5F1',
        },
        text: {
          DEFAULT: '#260907',
          secondary: '#6E363C',
          muted: '#97A4AD',
        },
        border: {
          DEFAULT: '#CAD3DD',
          dark: '#97A4AD',
        },
        accent: {
          DEFAULT: '#D4793B',
          hover: '#B8652E',
        },
        // Semantic Colors
        success: '#6E7C52',
        warning: '#D4A45F',
        error: '#6E363C',
        info: '#97A4AD',
        // Partner Colors
        'partner-a': '#6E363C',
        'partner-b': '#A45F48',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '7': '1.75rem',
        '13': '3.25rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(38, 9, 7, 0.06)',
        'card-hover': '0 4px 16px rgba(38, 9, 7, 0.1)',
        'button': '0 2px 8px rgba(164, 95, 72, 0.15)',
        'button-hover': '0 4px 12px rgba(164, 95, 72, 0.25)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-small': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' },
        }
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-small': 'bounce-small 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}
