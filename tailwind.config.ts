import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enables toggling with `.dark`
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        body: ['"Inter"', "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.3" }],     // 12px
        sm: ["0.875rem", { lineHeight: "1.4" }],    // 14px
        base: ["1rem", { lineHeight: "1.5" }],      // 16px
        lg: ["1.125rem", { lineHeight: "1.6" }],    // 18px
        xl: ["1.25rem", { lineHeight: "1.4" }],     // 20px
        "2xl": ["1.5rem", { lineHeight: "1.3" }],   // 24px
        "3xl": ["1.875rem", { lineHeight: "1.2" }], // 30px
        "4xl": ["2.25rem", { lineHeight: "1.2" }],  // 36px
        "5xl": ["3rem", { lineHeight: "1.1" }],     // 48px
      },
      colors: {
        // Semantic tokens mapped to CSS variables
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
        },
      },
      screens: {
        // Mobile-first → progressively scale up
        sm: "640px",   // Tablets / small devices
        md: "768px",   // Medium devices
        lg: "1024px",  // Laptops
        xl: "1280px",  // Desktops
        "2xl": "1536px", // Large monitors
      },
      spacing: {
        // Helps with consistent padding/margins
        "safe-x": "max(env(safe-area-inset-left), env(safe-area-inset-right))",
        "safe-y": "max(env(safe-area-inset-top), env(safe-area-inset-bottom))",
      },
    },
  },
  plugins: [],
};

export default config;
