/** @type {import('tailwindcss').Config} */

const lightTheme = {
  primary: "#570DF8",
  secondary: "#F000B8",
  accent: "#37CDBE",
  neutral: "#3D4451",
  "base-100": "#FFFFFF",
  info: "#3ABFF8",
  success: "#36D399",
  warning: "#FBBD23",
  error: "#F87272",
};

const darkTheme = {
  primary: "#fde047",
  secondary: "#60a5fa",
  accent: "#fb923c",
  neutral: "#4b5563",
  "base-100": "#1f2937",
  info: "#60a5fa",
  success: "#86efac",
  warning: "#fde047",
  error: "#ef4444",
};

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },

  daisyui: {
    themes: [{ light: lightTheme, dark: darkTheme }],
  },

  plugins: [require("daisyui")],
};
