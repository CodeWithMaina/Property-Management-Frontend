import type { Config } from "tailwindcss";
import daisyui from "daisyui";

/**
 * ExtendedConfig — add daisyui typings for convenience
 */
interface ExtendedConfig extends Config {
  daisyui?: {
    themes?: boolean | string[];
    logs?: boolean;
  };
}

const config: ExtendedConfig = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          muted: "rgb(var(--color-surface-muted) / <alpha-value>)",
          hover: "rgb(var(--color-surface-hover) / <alpha-value>)",
        },

        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
          muted: "rgb(var(--color-primary-muted) / <alpha-value>)",
        },

        accent2: {
          DEFAULT: "rgb(var(--color-accent2) / <alpha-value>)",
          hover: "rgb(var(--color-accent2-hover) / <alpha-value>)",
          muted: "rgb(var(--color-accent2-muted) / <alpha-value>)",
        },

        neutral: {
          DEFAULT: "rgb(var(--color-neutral) / <alpha-value>)",
          muted: "rgb(var(--color-neutral-muted) / <alpha-value>)",
          hover: "rgb(var(--color-neutral-hover) / <alpha-value>)",
        },

        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          hover: "rgb(var(--color-success-hover) / <alpha-value>)",
          muted: "rgb(var(--color-success-muted) / <alpha-value>)",
        },
        error: {
          DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
          hover: "rgb(var(--color-error-hover) / <alpha-value>)",
          muted: "rgb(var(--color-error-muted) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          hover: "rgb(var(--color-warning-hover) / <alpha-value>)",
          muted: "rgb(var(--color-warning-muted) / <alpha-value>)",
        },
        info: {
          DEFAULT: "rgb(var(--color-info) / <alpha-value>)",
          hover: "rgb(var(--color-info-hover) / <alpha-value>)",
          muted: "rgb(var(--color-info-muted) / <alpha-value>)",
        },

        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          strong: "rgb(var(--color-border-strong) / <alpha-value>)",
          muted: "rgb(var(--color-border-muted) / <alpha-value>)",
          hover: "rgb(var(--color-border-hover) / <alpha-value>)",
        },

        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
          subtle: "rgb(var(--color-text-subtle) / <alpha-value>)",
          inverse: "rgb(var(--color-text-inverse) / <alpha-value>)",
        },

        disabled: {
          DEFAULT: "rgb(var(--color-disabled) / <alpha-value>)",
          text: "rgb(var(--color-disabled-text) / <alpha-value>)",
        },
        focus: "rgb(var(--color-focus) / <alpha-value>)",
      },

      // typography sizes for Tailwind utilities (optional)
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],    // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],// 14px
        base: ['1rem', { lineHeight: '1.5rem' }],   // 16px
        lg: ['1.125rem', { lineHeight: '1.5rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.35rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '1.2' }],   // 24px
        '3xl': ['1.875rem', { lineHeight: '1.15' }],// 30px
        '4xl': ['2.25rem', { lineHeight: '1.1' }],  // 36px
      },

      // subtle shadows for elevated surfaces
      boxShadow: {
        'surface-sm': '0 1px 2px 0 rgba(17,24,39,0.04)',
        'surface-md': '0 6px 18px -6px rgba(17,24,39,0.12)',
      },
    },
  },

  plugins: [daisyui],
  daisyui: { themes: false },
};

export default config;
