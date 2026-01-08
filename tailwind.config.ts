// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e3a8a',
        },
        secondary: {
          DEFAULT: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
    extend: {
    colors: {
        primary: '#0F3D2E',   // dark green
        secondary: '#6BAF92', // light green
    },
    },
  plugins: [],
}
