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
          50: '#fef5ee',
          100: '#fde8d7',
          200: '#fbcdae',
          300: '#f7b267',
          400: '#f79d65',
          500: '#f4845f',
          600: '#f27059',
          700: '#f25c54',
          800: '#d54d46',
          900: '#b84139',
        },
        orange: {
          50: '#fef5ee',
          100: '#fde8d7',
          200: '#fbcdae',
          300: '#f7b267',
          400: '#f79d65',
          500: '#f4845f',
          600: '#f27059',
          700: '#f25c54',
          800: '#d54d46',
          900: '#b84139',
        },
      },
    },
  },
  plugins: [],
}
