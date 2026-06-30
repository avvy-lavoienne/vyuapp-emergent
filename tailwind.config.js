/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    theme: {
      container: {
        center: true,
        padding: '2rem',
        screens: { '2xl': '1400px' }
      },
      extend: {
        fontFamily: {
          sans: ['Satoshi', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        colors: {
          accent: {
            DEFAULT: '#6D5BA0',
            hover: '#574886',
            light: '#EDEAF5',
          },
          surface: {
            DEFAULT: '#FFFFFF',
            secondary: '#F8F7F4',
          },
          border: '#E5E4E0',
          sand: {
            50: '#FAFAF8',
            100: '#F4F3EE',
            200: '#E5E4E0',
            300: '#D1D0C9',
            400: '#737370',
            500: '#636360',
            600: '#6B6B68',
            700: '#4A4A48',
            800: '#2C2C2A',
            900: '#141413',
          },
          mauve: {
            50: '#F5F3FA',
            100: '#EDEAF5',
            200: '#D5CFE8',
            300: '#B8AED8',
            400: '#9C91C6',
            500: '#6D5BA0',
            600: '#574886',
            700: '#44396C',
            800: '#352C57',
            900: '#261F40',
          },
        },
        keyframes: {
          'fade-up': {
            from: { opacity: '0', transform: 'translateY(16px)' },
            to: { opacity: '1', transform: 'translateY(0)' },
          },
          'fade-in': {
            from: { opacity: '0' },
            to: { opacity: '1' },
          },
        },
        animation: {
          'fade-up': 'fade-up 0.6s ease-out',
          'fade-in': 'fade-in 0.6s ease-out',
        }
      }
    },
    plugins: [],
  }
