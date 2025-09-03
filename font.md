📖 Typography Guide – Rental Management System

This document defines the typography system for the Rental Management System. It ensures a consistent, luxurious, and professional look across all screens while supporting responsiveness and accessibility.

🎨 Font Selection

Headings (Luxury Accent):

Playfair Display (serif, elegant, high-end)

Body & UI Text (Clarity & Usability):

Inter (sans-serif, modern, highly readable)

👉 Combination: Playfair Display for prestige, Inter for readability.

🔠 Font Weights

Headings: 600–700 (Semi-bold → Bold)

Body Text: 400 (Regular)

Captions & Labels: 500 (Medium emphasis)

Numbers / Financial Data: Tabular Inter for alignment consistency

📏 Font Sizes & Responsive Scaling
Element	Mobile (sm)	Tablet (md)	Desktop (lg)
H1 (Page Title)	3xl (30px)	4xl (36px)	5xl (48px)
H2 (Section Title)	2xl (24px)	3xl (30px)	4xl (36px)
H3 (Subsection)	xl (20px)	2xl (24px)	2xl (24px)
Body (Paragraph)	base (16px)	lg (18px)	lg (18px)
Secondary / Muted	sm (14px)	sm (14px)	base (16px)
Captions & Labels	xs (12px)	sm (14px)	sm (14px)
📐 Line Height

Headings: leading-tight (1.1–1.2)

Body: leading-relaxed (1.5)

Captions: leading-snug (1.3)

🎨 Color & Luxury Feel

Primary Text: Deep Navy #0B1A33

Secondary Text: Slate #64748B

Accents (Luxury Highlight): Gold #C5A572 / Champagne #E6D5B8

Disabled / Muted: Cool Gray #94A3B8

⚙️ Tailwind Config (Typography Tokens)
// tailwind.config.js
export default {
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.3' }],   // 12px
        sm: ['0.875rem', { lineHeight: '1.4' }],  // 14px
        base: ['1rem', { lineHeight: '1.5' }],    // 16px
        lg: ['1.125rem', { lineHeight: '1.6' }],  // 18px
        xl: ['1.25rem', { lineHeight: '1.4' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '1.2' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2' }], // 36px
        '5xl': ['3rem', { lineHeight: '1.1' }],   // 48px
      },
    },
  },
}

🛠 Using Tailwind Config in React + Vite

Yes ✅ — tailwind.config.js works natively in a React + Vite app. Here’s how:

1. Install Tailwind in Vite + React
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


This creates:

tailwind.config.js

postcss.config.js

2. Configure Tailwind with Custom Fonts

Add Google Fonts in index.html:

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">


Add font tokens in tailwind.config.js (as shown above).

3. Add Tailwind Directives in CSS

In src/index.css (or src/global.css):

@tailwind base;
@tailwind components;
@tailwind utilities;

4. Use in Components
function DashboardTitle() {
  return (
    <h1 className="font-heading text-4xl text-[#0B1A33]">
      Luxury Rentals Dashboard
    </h1>
  );
}

function BodyText() {
  return (
    <p className="font-body text-base text-slate-600 leading-relaxed">
      Manage properties, leases, and payments with ease.
    </p>
  );
}


👉 React + Vite will compile Tailwind classes, pulling your custom fonts and sizes from tailwind.config.js.

✅ Result: A luxury-feel typography system that is scalable, responsive, and consistent across your rental management system.











1. Typography Philosophy

Clarity & hierarchy: Dashboard users scan quickly. Typography must clearly establish information hierarchy without visual clutter.

Data density: Use compact but legible sizes for tables and lists; preserve adequate line-height for reading long text blocks.

Consistency: Use a limited set of font families and a single, predictable scale so components remain consistent across the product.

Accessibility: Ensure body text meets minimum readable size (16px recommended in browser default), and that headings and controls comply with WCAG contrast and sizing recommendations.

2. Font Families & Pairing
Primary UI Typeface

Inter (prefer Inter Variable where possible)

Fallback stack: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial

Why Inter? Neutral, highly legible at small sizes, excellent variable font support for weight/width axes. Ideal for dense dashboards.

Secondary / Display Typeface

Merriweather or Source Serif Pro (for editorial or reporting pages where a serif adds gravitas)

Fallback stack: "Merriweather", Georgia, "Times New Roman", serif

When to use: Large hero headings in reporting pages, printable reports, or marketing pages tied to the dashboard.

Monospace (code / data)

JetBrains Mono or Fira Code

Fallback: ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace

When to use: Code snippets, terminal panels, CSV previews, timestamps aligned in tables.

3. System Tokens & CSS Variables

Provide CSS variables that map to the type scale. Example (drop into your main stylesheet):

:root {
  /* Font families */
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  --font-serif: Merriweather, Georgia, "Times New Roman", serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace;


  /* Type scale */
  --type-xxl: 40px; /* H1 large screens */
  --type-xl: 28px;  /* H1 / Hero */
  --type-2xl: 24px; /* H2 */
  --type-xl-2: 20px; /* H3 */
  --type-lg: 18px;  /* H4 / Section */
  --type-base: 16px; /* Body */
  --type-sm: 14px;  /* Small body / captions */
  --type-xs: 12px;  /* UI micro text / table metadata */


  /* Line heights */
  --leading-tight: 1.1;
  --leading-normal: 1.4;
  --leading-relaxed: 1.6;


  /* Weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}

Note: If using a design system token library (Tailwind, Figma Tokens), map the same tokens there to keep parity between design and code.

4. Headings, Display & Content Scale

Use the following practical scale with examples of usage and recommended typographic settings.

Token	Desktop size	Mobile size	Line-height	Letter-spacing	Weight	Use case
H1 / Page Title	28–40px (prefer 32px desktop, 28px mobile)	28px	1.1–1.2	-0.02em	600–700	Page headers, dashboards with large titles
H2 / Section Title	24px	20px	1.15	-0.02em	600	Section headers on pages and cards
H3	20px	18px	1.2	0	600	Sub-sections, modal titles
H4	18px	16px	1.25	0	600	Card headers, list group headings
Body / Paragraph	16px	16px	1.4–1.6	0	400	Main content, descriptions
Small / UI text	14px	14px	1.3	0	400–500	Form labels, helper text
Caption / Meta	12px	12px	1.2	0	400	Timestamps, table secondary text
Button (Primary)	14–16px	14px	1.1	0.02em	600	CTA and primary actions
Input text	14–16px	14px	1.2	0	400	Form inputs, select values

Practical examples (CSS snippets)

.h1 { font-family: var(--font-sans); font-size: var(--type-xl); line-height: var(--leading-tight); font-weight: var(--weight-semibold); }
.h2 { font-family: var(--font-sans); font-size: var(--type-2xl); line-height: 1.15; font-weight: var(--weight-semibold); }
.p { font-family: var(--font-sans); font-size: var(--type-base); line-height: var(--leading-normal); font-weight: var(--weight-regular); }
.small { font-size: var(--type-sm); line-height: 1.3; }
.caption { font-size: var(--type-xs); line-height: 1.2; color: var(--muted-500); }
5. Component Typography Guidance
Navigation (SideNav / TopNav)

SideNav items: 14–15px, --weight-medium (500), letter-spacing 0.02em for legibility.

Active item: semibold (600), uppercase optional for emphasis.

Submenu / collapsed labels: 12–13px with slightly tighter line-height.

Cards & Panels

Card title: 16–18px semibold.

Card body: 14–16px, regular.

Card metadata (dates, tags): 12px caption style.

Tables & Data Grids

Table header: 12–13px uppercase, --weight-medium (500), letter-spacing 0.04em.

Table body: 13–14px — keep consistent font-size across dense tables for readability.

Numeric columns: use monospace for alignment when precision matters (e.g., balances, IDs).

Forms / Inputs

Field label: 14px medium (500).

Placeholder: 14px regular, use a muted color and do not rely solely on placeholders for labels.

Helper text / errors: 12px caption; errors should be semibold if critical.

Buttons

Primary button: 14–16px, semibold (600), letter-spacing 0.02–0.04em, uppercase optional.

Secondary button: same size but medium (500) weight.

Icon buttons: keep label size consistent with UI text (14px) and center vertically.

Modals & Dialogs

Modal title: 20px semibold.

Body text: 16px normal.

Action buttons: 14px semibold.

6. Responsive Scaling & Breakpoints

Recommended approach: scale typography fluidly using CSS clamp() for headings and key scales.

Example: fluid H1

.h1 {
  font-size: clamp(28px, 4vw + 12px, 40px);
}

For body text, keep a stable 16px and adjust container width rather than font-size for best legibility on mobile.

Breakpoints (suggested):

Mobile: < 640px — use mobile sizes

Tablet: 641–1024px — slightly larger headings

Desktop: > 1024px — use full desktop scale

7. Accessibility & Contrast

Base body font-size must be at least 16px for mobile browsers (prevents automatic zooming and preserves legibility).

Ensure contrast ratio meets WCAG AA for normal text (>= 4.5:1) and WCAG AAA for large text (>= 7:1 desirable for key UI elements).

Provide increased line-height for long-form text to improve readability (1.5 recommended for articles).

8. Performance & Loading

Use variable fonts (e.g., Inter Variable) to reduce font file count and improve FOUT/FOIT behavior.

Load fonts with font-display: swap and preload the fonts critical to initial render.

Example (HTML head):

<link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin>
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter-Variable.woff2') format('woff2');
    font-display: swap;
    font-weight: 100 900;
  }
</style>
9. Tokens for Design Systems (Figma / Tailwind mapping)

Figma token examples:

type.h1.size = 32px

type.h1.weight = 600

type.body.size = 16px

font.family.sans = Inter

Tailwind mapping suggestions:

text-2xl → H2, font-semibold

text-xl → H3, font-semibold

text-base → Body, font-normal

Add custom Tailwind theme values if you want exact parity with the token values.

10. Examples & Do / Don’t

Do

Use Inter for all UI elements; reserve serif only for long-form display contexts.

Keep body text at 16px and scale headings for emphasis.

Use monospace for numerical alignment in tables.

Prefer variable fonts and preload critical fonts.

Don’t

Don’t use tiny type (<12px) for interactive elements.

Don’t rely on color alone to indicate hierarchy or state—combine weight, size, and clear affordances.

Don’t mix too many type families—stick to 2 (sans + mono) or 3 (add serif for reports).

11. Implementation Checklist




12. Appendix — Quick Reference (Pixel values)

H1: 32px (desktop), 28px (mobile)

H2: 24px (desktop), 20px (mobile)

H3: 20px / 18px

H4: 18px / 16px

Body: 16px

Small/UI: 14px

Caption: 12px