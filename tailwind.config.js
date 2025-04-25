/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ Enables dark mode with class
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
