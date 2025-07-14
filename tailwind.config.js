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
          50: '#F0F8FF',
          100: '#E0F2F7',
          200: '#C0E0EB',
          300: '#A0CFE0',
          400: '#80BDD5',
          500: '#60ACC9',
          600: '#409BBF',
          700: '#208AA5',
          800: '#00798B',
          900: '#005864',
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