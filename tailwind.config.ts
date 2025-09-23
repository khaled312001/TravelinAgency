import type { Config } from 'tailwindcss'
// import materialForms from './plugins/material-forms'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        display: ['Roboto Serif', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#40a0d8',
          50: '#f0f8fd',
          100: '#e0f1fa',
          200: '#bce3f5',
          300: '#98d4ef',
          400: '#74c6ea',
          500: '#40a0d8',
          600: '#3990c2',
          700: '#3280ac',
          800: '#2b7096',
          900: '#246080',
          950: '#1c506a'
        },
        secondary: {
          DEFAULT: '#E8DEF8',
          50: '#F6EDFF',
          100: '#E8DEF8',
          200: '#CCC2DC',
          300: '#B0A7C0',
          400: '#958DA5',
          500: '#7A7289',
          600: '#605D6C',
          700: '#484649',
          800: '#313033',
          900: '#1D1B20',
          950: '#141316',
        },
        surface: {
          DEFAULT: '#FFFBFE',
          dim: '#DED8E1',
          bright: '#FEF7FF',
          container: {
            lowest: '#FFFFFF',
            low: '#F7F2FA',
            DEFAULT: '#F3EDF7',
            high: '#ECE6F0',
            highest: '#E6E0E9',
          }
        },
        outline: {
          DEFAULT: '#79747E',
          variant: '#CAC4D0',
        }
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'elevation-2': '0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'elevation-3': '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-down': 'fadeDown 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-up': 'scaleUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        scaleUp: {
          '0%': {
            transform: 'scale(0.95)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config