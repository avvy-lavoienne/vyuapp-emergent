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
          display: ['var(--font-display)', 'Iowan Old Style', 'Georgia', 'serif'],
          mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        },
        colors: {
          paper: 'var(--paper)',
          paper2: 'var(--paper-2)',
          surface: 'var(--surface)',
          ink: 'var(--ink)',
          ink2: 'var(--ink-2)',
          muted: 'var(--muted)',
          rule: 'var(--rule)',
          clay: 'var(--clay)',
          clayStrong: 'var(--clay-strong)',
          moss: 'var(--moss)',
          accent: {
            DEFAULT: 'var(--clay)',
            hover: 'var(--clay-strong)',
            light: 'var(--clay-wash)',
          },
        },
        borderRadius: {
          none: '0px',
          sm: '2px',
          DEFAULT: '2px',
          md: '3px',
          lg: '4px',
          xl: '6px',
          '2xl': '8px',
          full: '9999px',
        },
        maxWidth: {
          page: '1400px',
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
