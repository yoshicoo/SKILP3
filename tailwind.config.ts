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
          50: "#F2FBFA",
          100: "#D4F4F3",
          200: "#B6EDEA",
          300: "#81D8D0",
          400: "#6FCED5",
          500: "#5dc1cf",
          600: "#0ABAB5",
          700: "#099A96",
          800: "#077E7B",
          900: "#055F5C"
        }
      }
    },
  },
  plugins: [],
};
export default config;