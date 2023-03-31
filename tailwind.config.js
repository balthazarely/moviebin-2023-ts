/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      aspectRatio: {
        "2/3": "2 / 3",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["night", "dark", "corporate", "business", "luxury"],
  },
};
