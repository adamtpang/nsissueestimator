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
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#FF9B54',
          400: '#FF7F51',
          500: '#CE4257',
          600: '#720026',
          700: '#4F000B',
          800: '#3F0009',
          900: '#2F0007',
        },
        red: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#FF9B54',
          400: '#FF7F51',
          500: '#CE4257',
          600: '#720026',
          700: '#4F000B',
          800: '#3F0009',
          900: '#2F0007',
        },
        brand: {
          'lightest': '#FF9B54',
          'light': '#FF7F51',
          'medium': '#CE4257',
          'bright': '#720026',
          'deep': '#4F000B',
          'darker': '#3F0009',
          'darkest': '#2F0007',
        },
      },
    },
  },
  plugins: [],
}
