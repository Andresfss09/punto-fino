/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4af37',
          600: '#b8960c',
          700: '#92750a',
          800: '#78600e',
          900: '#713f12',
        },
        dark: {
          50: '#1a1a1a',
          100: '#141414',
          200: '#111111',
          300: '#0d0d0d',
          400: '#0a0a0a',
          500: '#080808',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        glow: { '0%': { boxShadow: '0 0 5px #d4af37' }, '100%': { boxShadow: '0 0 20px #d4af37, 0 0 40px #d4af3730' } },
      },
    },
  },
  plugins: [],
};