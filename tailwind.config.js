/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Teal Palette
        primary: {
          DEFAULT: '#007A87', // Teal/Cyan
          dark: '#005F69',    // Darker Teal
          light: '#E0F2F1',   // Very Light Teal
        },
        background: '#F2F4F8', // Light Gray/Blueish
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F5F5F1', // Keeping for compatibility, though not explicitly in new design
        },
        text: {
          DEFAULT: '#1D1D1D',   // Almost Black
          secondary: '#555555', // Dark Gray
          muted: '#888888',     // Gray
        },
        border: {
          DEFAULT: '#E0E0E0',   // Light Gray
          dark: '#F0F0F0',      // Very Light Gray (Divider)
        },
        
        // Status Colors
        success: '#007A87', // Teal as success
        warning: '#FF9800', // Orange
        error: '#D32F2F',   // Red
        info: '#007A87',    // Teal
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '7': '1.75rem',
        '13': '3.25rem',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        '4xl': '2rem', // Keeping for compatibility if used
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'floating': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        // Keeping previous shadows for compatibility if needed, or mapping them
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
