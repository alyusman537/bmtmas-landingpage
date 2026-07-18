/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kop-bg': '#f9f9f9',
        'kop-blue': '#356296',
        'kop-green': '#00a860',
      },
    },
  },
  plugins: [],
}