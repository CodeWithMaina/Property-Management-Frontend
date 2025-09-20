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
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },

      /* Map CSS variables into Tailwind */
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

        neutral: {
          DEFAULT: "rgb(var(--color-neutral) / <alpha-value>)",
          hover: "rgb(var(--color-neutral-hover) / <alpha-value>)",
          muted: "rgb(var(--color-neutral-muted) / <alpha-value>)",
        },

        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          hover: "rgb(var(--color-success-hover) / <alpha-value>)",
          muted: "rgb(var(--color-success-muted) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          hover: "rgb(var(--color-warning-hover) / <alpha-value>)",
          muted: "rgb(var(--color-warning-muted) / <alpha-value>)",
        },
        error: {
          DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
          hover: "rgb(var(--color-error-hover) / <alpha-value>)",
          muted: "rgb(var(--color-error-muted) / <alpha-value>)",
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
          inverse: "rgb(var(--color-text-inverse) / <alpha-value>)",
        },

        disabled: {
          DEFAULT: "rgb(var(--color-disabled) / <alpha-value>)",
          text: "rgb(var(--color-disabled-text) / <alpha-value>)",
        },

        focus: "rgb(var(--color-focus) / <alpha-value>)",
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.5rem' }],
        xl: ['1.25rem', { lineHeight: '1.35rem' }],
        '2xl': ['1.5rem', { lineHeight: '1.2' }],
        '3xl': ['1.875rem', { lineHeight: '1.15' }],
        '4xl': ['2.25rem', { lineHeight: '1.1' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },

      spacing: {
        px: '1px',
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
      },

      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
      },

      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '350ms',
      },
    },
  },
  plugins: [daisyui],
  daisyui: { themes: false },
};

export default config;