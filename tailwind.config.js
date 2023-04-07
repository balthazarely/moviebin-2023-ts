/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
      aspectRatio: {
        "2/3": "2 / 3",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "night",
      "synthwave",
      "forest",
      "dark",
      "corporate",
      "business",
      "luxury",
      "dracula",
      "light",
      "garden",
      "corporate",
      "pastel",
      "autumn",
    ],
  },
};
