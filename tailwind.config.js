/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        linen: '#F2EDE6',
        'warm-white': '#FFFDF9',
        blush: '#D4A89A',
        'blush-light': '#EDD5CD',
        charcoal: '#2C2C2C',
        'warm-gray': '#8A8480',
        gold: '#C9A96E',
        'black-soft': '#1A1A1A',
      },
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}
