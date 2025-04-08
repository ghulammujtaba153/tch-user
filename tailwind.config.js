/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        onest: ['Onest', 'sans-serif'],
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

