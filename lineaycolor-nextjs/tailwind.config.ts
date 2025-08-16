import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        accent: "#c9a961",
        light: "#f8f8f8",
      },
      fontFamily: {
        sans: ["Raleway", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      animation: {
        "gradient-shift": "gradientShift 15s ease infinite",
        "fade-in-up": "fadeInUp 1s ease forwards",
        "float": "float 6s ease-in-out infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
      },
      letterSpacing: {
        wider: "2px",
        widest: "3px",
      },
    },
  },
  plugins: [],
};

export default config;