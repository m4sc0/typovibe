/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./commandPalette.js"],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--color-accent))',
        color: {
          900: 'rgb(var(--color-900))',
          800: 'rgb(var(--color-800))',
          700: 'rgb(var(--color-700))',
          600: 'rgb(var(--color-600))',
          500: 'rgb(var(--color-500))',
          400: 'rgb(var(--color-400))',
          300: 'rgb(var(--color-300))',
          200: 'rgb(var(--color-200))',
          100: 'rgb(var(--color-100))',
        },
      },
    },
  },
  plugins: [],
}
