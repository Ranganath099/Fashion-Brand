/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 👈 THIS FIXES DARK MODE
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
