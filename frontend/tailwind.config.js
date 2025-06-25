// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Raleway", "sans-serif"],
        body:    ["Open Sans", "sans-serif"],
        script:  ["Merienda", "cursive"],
        slab:    ["Roboto Slab", "serif"],
      },
      colors: {
        gold:    "#E3B23C",
        maroon:  "#A9252B",
        navy:    "#1E3A8A",
        slate:   "#334155",
        light:   "#F7F7F7",
        sl: {
          navy: "#0a2540",
          sky:  "#0c2f5a",
          red:  "#ff1f49",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      }
    },
  },
  plugins: [],
}
