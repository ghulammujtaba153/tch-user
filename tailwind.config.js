/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // sora: ['Sora', 'sans-serif'],
        // libre: ['"Libre Franklin"', 'sans-serif'],
        // news: ['"News Cycle"', 'sans-serif'],
        // onest: ['Onest', 'sans-serif'],

        sans: ['"Libre Franklin"', 'sans-serif'],
        onest: ['"News Cycle"', 'sans-serif'],
      },
      colors: {
        primary: "#BFDCFC", 
        secondary: "#0033AA",
        bg: "#F2F6FF",
      },
    },
  },
  plugins: [],
}

