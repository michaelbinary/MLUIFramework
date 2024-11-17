/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        up: '#16a34a',    // green-600
        down: '#dc2626',  // red-600
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        }
      },
      backgroundColor: {
        'ticker-light': '#ffffff',
        'ticker-dark': '#171717',
        'ticker-hover-light': '#f8fafc',
        'ticker-hover-dark': '#262626',
      },
      textColor: {
        'ticker-light': '#171717',
        'ticker-dark': '#f8fafc',
      },
      borderColor: {
        'ticker-light': '#e5e7eb',
        'ticker-dark': '#404040',
      }
    },
  },
  plugins: [],
}