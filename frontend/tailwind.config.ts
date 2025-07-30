import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--aqua))",
          hover: "hsl(var(--aqua-hover))",
          dark: "hsl(var(--aqua-dark))",
          "dark-hover": "hsl(var(--aqua-dark-hover))",
          light: "hsl(var(--aqua-light))",
          "light-hover": "hsl(var(--aqua-light-hover))",
        },
        "shr-blue": {
          DEFAULT: "hsl(var(--shr-blue))",
          hover: "hsl(var(--shr-blue-hover))",
        },
        form: {
          main: "hsl(var(--form-main))",
          "main-hover": "hsl(var(--form-main-hover))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          hover: "hsl(var(--warning-hover))",
        },
        caution: {
          DEFAULT: "hsl(var(--caution))",
          hover: "hsl(var(--caution-hover))",
          border: "hsl(var(--caution-border))",
        },
      },
    },
  },
  plugins: [],
};

export default config; 