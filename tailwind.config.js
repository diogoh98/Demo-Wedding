/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F4F0EC',
        linen: '#E8E3DF',
        'warm-white': '#FFFFFF',
        gold: '#D4AF37',
        'gold-light': '#E5C973',
        charcoal: '#0A0A0A',
        'charcoal-light': '#141414',
        'warm-gray': '#9CA3AF',
        'black-soft': '#050505',
      },
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}
