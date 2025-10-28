/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF9F0',
          100: '#FFF3E0',
          200: '#FFE7C2',
          300: '#FFDD00',
          400: '#FFD000',
          500: '#FFC300',
          600: '#FFB700',
          700: '#FFAA00',
          800: '#FFA200',
          900: '#FF9500',
        },
        orange: {
          50: '#FFF9F0',
          100: '#FFF3E0',
          200: '#FFE7C2',
          300: '#FFEA00',
          400: '#FFDD00',
          500: '#FFD000',
          600: '#FFC300',
          700: '#FFB700',
          800: '#FFAA00',
          900: '#FFA200',
        },
        brand: {
          'bright': '#FF7B00',
          'orange-1': '#FF8800',
          'orange-2': '#FF9500',
          'orange-3': '#FFA200',
          'orange-4': '#FFAA00',
          'orange-5': '#FFB700',
          'orange-6': '#FFC300',
          'orange-7': '#FFD000',
          'orange-8': '#FFDD00',
          'yellow': '#FFEA00',
        },
      },
    },
  },
  plugins: [],
}
