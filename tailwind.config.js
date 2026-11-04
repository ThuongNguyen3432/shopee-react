/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'shopee-orange': '#ee4d2d',
        'shopee-orange-light': '#fff5f3',
        'shopee-red': '#f53d2d',
        'bg-gray': '#f5f5f5',
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}