/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sectionBg: "#111827",
        skyBlue: "#374151",
        skyBlue2: "#321749",
        skyBlue3: "#4A305F",
      },
      fontFamily: {
        sans: ["Nunito Sans", "sans-serif"],
      },

      gridTemplateColumns: {
        devicesGrid: "repeat(4, minmax(0, 400px)",
        phoneGrid: "repeat(4, minmax(0, 270px))",
      },
    },
    screens: {
      mobile: "350px",
      // => @media (min-width: 640px) { ... }

      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }

      desktop: "1280px",
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [],
};
