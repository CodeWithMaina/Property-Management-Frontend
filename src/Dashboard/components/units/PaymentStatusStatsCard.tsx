// import * as React from "react";

// /**
//  * Props for the PaymentStatusStatsCard component.
//  */
// export interface PaymentStatusStatsCardProps {
//   /**
//    * Short, human-readable title for the metric.
//    * Example: "Active Leases"
//    */
//   title: string;

//   /**
//    * Numeric value to display. Use integers or decimals.
//    * Example: 128, 42.7
//    */
//   value: number;

//   /**
//    * Any valid CSS color string used to fill the indicator circle.
//    * Example: "#10b981", "rgb(59 130 246)", "hsl(142 76% 36%)", "rebeccapurple"
//    */
//   color: string;

//   /**
//    * Optional width of the card. Accepts number (px) or CSS size string (e.g., "18rem", "100%").
//    * If omitted, the card will be responsive (100% width on mobile).
//    */
//   width?: number | string;

//   /**
//    * Optional height of the card. Accepts number (px) or CSS size string (e.g., "5rem", "64px").
//    * If omitted, the card will size naturally to its content.
//    */
//   height?: number | string;

//   /**
//    * Optional className to extend/override styling (Tailwind utilities, etc.).
//    */
//   className?: string;

//   /**
//    * Optional ARIA label for improved accessibility if the title alone isn't sufficient.
//    */
//   ariaLabel?: string;

//   /**
//    * Optional test id for E2E/unit tests.
//    */
//   "data-testid"?: string;
// }

// /**
//  * A compact, horizontally-stacked metric card:
//  * [Title] — [Colored Circle] — [Number]
//  *
//  * - Uses semantic Tailwind tokens for background, border, and text.
//  * - Fully responsive: defaults to 100% width on mobile, scales with breakpoints.
//  * - Dark/Light mode aware using CSS variables in Tailwind config.
//  * - Strongly typed and memoized to minimize re-renders.
//  */
// export const PaymentStatusStatsCard: React.FC<PaymentStatusStatsCardProps> = React.memo(
//   ({
//     title,
//     value,
//     color,
//     width,
//     height,
//     className = "",
//     ariaLabel,
//     ...rest
//   }) => {
//     // Normalize width/height to valid CSS values only when provided.
//     const containerStyle = React.useMemo<React.CSSProperties>(() => {
//       const style: React.CSSProperties = {};
//       if (width !== undefined) style.width = typeof width === "number" ? `${width}px` : width;
//       if (height !== undefined) style.height = typeof height === "number" ? `${height}px` : height;
//       return style;
//     }, [width, height]);

//     // Circle color is dynamic; use inline style to avoid Tailwind purge issues.
//     const dotStyle = React.useMemo<React.CSSProperties>(
//       () => ({ backgroundColor: color }),
//       [color]
//     );

//     // Use tabular numbers for stable alignment of values.
//     const formattedValue = React.useMemo(() => value, [value]);

//     return (
//       <div
//         role="group"
//         aria-label={ariaLabel ?? `${title} ${value}`}
//         style={containerStyle}
//         className={[
//           // Layout
//           "flex flex-col items-center justify-between",
//           // Sizing & spacing (p-4 is a sensible default for dashboards)
//           "p-4",
//           // Responsive widths: full width on mobile → scale up
//           "w-full sm:w-1/2 md:w-1/3 lg:w-1/4",
//           // Visuals: semantic background, border, shadow
//           "rounded-2xl border bg-surface shadow-sm border-border",
//           // Interactions
//           "transition-shadow hover:shadow-md focus-within:shadow-md",
//           // Allow external overrides
//           className,
//         ].join(" ")}
//         {...rest}
//       >
//         {/* Title */}
//         <h3
//           className={[
//             "min-w-0 shrink text-2xl font-bold tracking-[-0.01em]",
//             "text-text-secondary",
//             "truncate",
//           ].join(" ")}
//           title={title}
//         >
//           {title}
//         </h3>

//         {/* Colored circle indicator */}
//         <span
//           aria-hidden="true"
//           style={dotStyle}
//           className={[
//             "h-3 w-3 rounded-full",
//             // Add a subtle ring to maintain visibility on both themes
//             "ring-2 ring-background",
//             "shadow",
//           ].join(" ")}
//         />

//         {/* Number */}
//         <strong
//           className={[
//             " tabular-nums",
//             "text-xl font-semibold",
//             "text-text-primary",
//             "select-none",
//           ].join(" ")}
//         >
//           {formattedValue}
//         </strong>
//       </div>
//     );
//   }
// );

// PaymentStatusStatsCard.displayName = "PaymentStatusStatsCard";

// /* ===========================
//    ✅ Example Usage (Parent)
//    ---------------------------
//    <PaymentStatusStatsCard
//      title="Active Leases"
//      value={128}
//      color="rgb(34 197 94)"   // success green
//      width="20rem"            // or 320, "100%" (optional)
//      height={96}              // px; or "6rem" (optional)
//      className="md:min-w-[18rem]" // Optional Tailwind overrides
//    />
//    =========================== */
