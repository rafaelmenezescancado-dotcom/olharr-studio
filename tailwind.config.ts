import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8e8',
          100: '#f9ecc4',
          200: '#f3d98a',
          300: '#ecc44e',
          400: '#c8a44e',
          500: '#a88a3e',
          600: '#8a6f30',
          700: '#6b5524',
          800: '#4d3c1a',
          900: '#2e2310',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
