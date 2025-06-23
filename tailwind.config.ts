import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#22c55e", // green-500
          dark: "#16a34a", // green-600
          light: "#4ade80", // green-300
        },
        secondary: {
          DEFAULT: "#fbbf24", // yellow-400
          dark: "#f59e42", // yellow-500
          light: "#fde68a", // yellow-200
        },
        accent: {
          DEFAULT: "#0ea5e9", // sky-500
          dark: "#0369a1", // sky-700
          light: "#7dd3fc", // sky-300
        },
        success: "#22c55e",
        warning: "#fbbf24",
        error: "#ef4444",
      },
    },
  },
  plugins: [],
};

export default config;
