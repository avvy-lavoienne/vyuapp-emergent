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
          sans: ['var(--font-sans)', 'Satoshi', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        colors: {
          accent: {
            DEFAULT: '#2997ff',
            hover: '#0066cc',
            light: '#E8F4FD',
          },
          surface: {
            DEFAULT: '#FFFFFF',
            secondary: '#f5f5f7',
          },
          border: '#d2d2d7',
          gray: {
            50: '#f5f5f7',
            100: '#e8e8ed',
            200: '#d2d2d7',
            300: '#b0b0b6',
            400: '#86868b',
            500: '#6e6e73',
            600: '#545458',
            700: '#424245',
            800: '#333336',
            900: '#1d1d1f',
          },
          blue: {
            50: '#E8F4FD',
            100: '#C5E3FA',
            200: '#8DC8F5',
            300: '#5BA3FF',
            400: '#2997ff',
            500: '#0077ED',
            600: '#0066cc',
            700: '#0055AA',
            800: '#004499',
            900: '#003366',
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
