import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(222 47% 6%)",
        surface: "hsl(222 30% 11%)",
        accent: "hsl(199 89% 48%)",
      },
    },
  },
  plugins: [],
};

export default config;
