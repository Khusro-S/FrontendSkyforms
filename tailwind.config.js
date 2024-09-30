/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: "#E6DCFD",
        black: "#1a1a1a",
        blackbg: "#242424",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow": {
          "text-shadow": "2px 2px 10px #E6DCFD80",
        },
        ".text-shadow-lg": {
          "text-shadow": "3px 3px 15px #E6DCFD80",
        },
        ".shadow": {
          "box-shadow": "3px 3px 25px #E6DCFD80",
        },
      });
    },
  ],
};
