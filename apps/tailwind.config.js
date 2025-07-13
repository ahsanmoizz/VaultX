/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./apps/**/*.{js,ts,jsx,tsx}",
    "./packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#000000",
          primary: "#FDB813",      // Yellow
          secondary: "#FFFFFF",    // White
          accent: "#3AB54A",       // Optional for highlights (like success)
          muted: "#1f1f1f",        // Panel background
        },
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "Inter", "ui-sans-serif", "sans-serif"],
        heading: ["'Space Grotesk'", "sans-serif"], // Optional modern alt
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out both",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};
