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
        primary: {
          DEFAULT: "#FED835",
          dark: "#E5C230",
          light: "#FFF4B3",
        },
        secondary: {
          DEFAULT: "#304FFF",
          dark: "#1E3AE6",
          light: "#7A8FFF",
        },
        tertiary: {
          DEFAULT: "#FED835",
          dark: "#E5C230",
          light: "#FFF4B3",
          darkest: "#CCAA00",
        },
        detective: "#52C364",
        explorer: "#7ED321",
        scientist: "#30E77F",
        artist: "#A4FFC0",
        success: "#30E77F",
        warning: "#FFA726",
        error: "#EF5350",
        info: "#52C364",
        surface: "#F5F5F5",
        "surface-variant": "#E8E8E8",
        background: "#FFFFFF",
        "on-surface": "#1A1A1A",
        "on-surface-variant": "#666666",
        outline: "#CCCCCC",
      },
      fontFamily: {
        sans: ["Source Sans 3", "sans-serif"],
        heading: ["Manrope", "sans-serif"],
      },
      fontSize: {
        "display-large": ["57px", { lineHeight: "1.2", letterSpacing: "-0.25px" }],
        "display-medium": ["45px", { lineHeight: "1.2", letterSpacing: "0px" }],
        "display-small": ["36px", { lineHeight: "1.2", letterSpacing: "0px" }],
        "headline-large": ["32px", { lineHeight: "1.2", letterSpacing: "0px", fontWeight: "600" }],
        "headline-medium": ["28px", { lineHeight: "1.2", letterSpacing: "0px", fontWeight: "600" }],
        "headline-small": ["24px", { lineHeight: "1.2", letterSpacing: "0px", fontWeight: "600" }],
        "title-large": ["22px", { lineHeight: "1.3", letterSpacing: "0px", fontWeight: "600" }],
        "title-medium": ["16px", { lineHeight: "1.4", letterSpacing: "0.15px", fontWeight: "600" }],
        "title-small": ["14px", { lineHeight: "1.4", letterSpacing: "0.1px", fontWeight: "600" }],
        "body-large": ["16px", { lineHeight: "1.5", letterSpacing: "0.5px", fontWeight: "400" }],
        "body-medium": ["14px", { lineHeight: "1.5", letterSpacing: "0.25px", fontWeight: "400" }],
        "body-small": ["12px", { lineHeight: "1.5", letterSpacing: "0.4px", fontWeight: "400" }],
        "label-large": ["14px", { lineHeight: "1.4", letterSpacing: "0.1px", fontWeight: "500" }],
        "label-medium": ["12px", { lineHeight: "1.4", letterSpacing: "0.5px", fontWeight: "500" }],
        "label-small": ["11px", { lineHeight: "1.4", letterSpacing: "0.5px", fontWeight: "500" }],
      },
      borderRadius: {
        small: "12px",
        medium: "16px",
        large: "24px",
      },
    },
  },
  plugins: [],
  darkMode: "media",
};

export default config;

