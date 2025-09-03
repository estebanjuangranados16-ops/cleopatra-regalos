/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        gifts: {
          primary: '#FFD300',
          'primary-dark': '#FFA500',
          'primary-light': '#FFF5CC',
          secondary: '#1E293B',
          accent: '#F59E0B',
        },
        tech: {
          primary: '#2563EB',
          'primary-dark': '#1D4ED8',
          'primary-light': '#DBEAFE',
          secondary: '#1E293B',
          accent: '#3B82F6',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}