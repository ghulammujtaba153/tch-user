/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Benton Sans"', 'sans-serif'],
        onest: ['"Benton Sans"', 'sans-serif'],
      },
      colors: {
        primary: "#BFDCFC", 
        primarylight: "#0051ff",
        secondary: "#0033AA",
        bg: "#F2F6FF",
      },
    },
  },
  plugins: [],
}
