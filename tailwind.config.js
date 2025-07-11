/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 淺藍色調
        'soft-blue': {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#00BCD4',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
        },
      },
      borderRadius: {
        'xl': '1rem', // 預設圓角加大
        '2xl': '2rem', // 更大的圓角
        '3xl': '3rem', // 極大的圓角
      }
    },
  },
  plugins: [],
}