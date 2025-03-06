/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Adjust based on your folder structure
    "./Components/**/*.{js,ts,jsx,tsx}",  // Adjust based on your folder structure
    "./Pages/**/*.{js,ts,jsx,tsx}",  // Adjust based on your folder structure
    "./Layout/**/*.{js,ts,jsx,tsx}",  // Adjust based on your folder structure
    "app/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
