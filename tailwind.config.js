/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#07070b',
          950: '#050508',
          900: '#0a0a10',
          800: '#111118',
          700: '#1a1a24',
          600: '#242430',
        },
        gold: {
          DEFAULT: '#d4af37',
          50: '#fbf6e7',
          100: '#f5e8bf',
          200: '#eed58a',
          300: '#e6c15a',
          400: '#dfb444',
          500: '#d4af37',
          600: '#b5872a',
          700: '#8f6620',
          800: '#6b4a17',
          900: '#4a320f',
        },
        bronze: {
          DEFAULT: '#a97142',
          light: '#c98f5c',
          dark: '#7a5230',
        },
        violet: {
          DEFAULT: '#7c5cff',
          soft: '#9b7cff',
          deep: '#4c2f9e',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f5e8bf 0%, #d4af37 45%, #a97142 100%)',
        'gold-gradient-soft': 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(169,113,66,0.08) 100%)',
        'violet-wash': 'radial-gradient(circle at 30% 20%, rgba(124,92,255,0.15), transparent 60%)',
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(212,175,55,0.35), 0 8px 30px -6px rgba(212,175,55,0.25)',
        'gold-lg': '0 0 0 1px rgba(212,175,55,0.4), 0 20px 60px -12px rgba(212,175,55,0.35)',
        card: '0 4px 24px -8px rgba(0,0,0,0.6)',
      },
      animation: {
        'gradient-x': 'gradient-x 6s ease infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
