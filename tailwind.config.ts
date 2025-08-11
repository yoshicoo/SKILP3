import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Inter', 'Helvetica', 'Arial']
      },
      colors: {
        primary: {
          50: "#f5f9ff",
          100: "#eaf2ff",
          200: "#cfe2ff",
          300: "#a4c6ff",
          400: "#79a9ff",
          500: "#568dff",
          600: "#3a6fe6",
          700: "#2f58b8",
          800: "#25428a",
          900: "#1a2c5c"
        }
      }
    },
  },
  plugins: [],
};
export default config;