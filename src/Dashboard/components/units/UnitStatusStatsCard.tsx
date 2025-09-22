// import React, { useMemo } from "react";
// import type { FC } from "react";
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// import { motion } from "framer-motion";

// /**
//  * Strongly-typed Recharts data item
//  */
// export type PieDataItem = {
//   name: string;
//   value: number;
//   color?: string;
// };

// export type StatItem = {
//   value: number | string;
//   label: string;
//   icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
// };

// export interface UnitStatusStatsCardProps {
//   data: PieDataItem[];
//   colors?: string[];
//   stats?: StatItem[];
//   /** Height reduced for slimmer layout */
//   height?: number;
//   /** Accessibility id for the chart */
//   ariaLabel?: string;
//   /** Total value to display in the middle of the chart */
//   totalValue: number | string;
// }

// const DEFAULT_COLORS = [
//   "rgb(var(--color-primary) / 1)",
//   "rgb(var(--color-success) / 1)",
//   "#F59E0B", // amber-500
//   "#E11D48", // rose-600
//   "#7C3AED", // violet-600
// ];

// /** Basic card shell */
// const Card: FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
//   <div
//     className={`rounded-2xl shadow-sm border border-[rgb(var(--color-border)/1)] 
//       bg-[rgb(var(--color-surface)/1)] text-[rgb(var(--color-text-primary)/1)] ${className}`}
//   >
//     {children}
//   </div>
// );

// const CardContent: FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
//   <div className={`px-4 py-3 ${className}`}>{children}</div>
// );

// /**
//  * UnitStatusStatsCard
//  * -----------------
//  */
// export const UnitStatusStatsCard: FC<UnitStatusStatsCardProps> = ({
//   data,
//   colors = DEFAULT_COLORS,
//   stats = [],
//   height = 180, // reduced height
//   ariaLabel = "Pie chart showing distribution",
//   totalValue,
// }) => {
//   const processed = useMemo(() => {
//     const fallback = colors.length ? colors : DEFAULT_COLORS;
//     return data.map((d, i) => ({
//       ...d,
//       _color: d.color ?? fallback[i % fallback.length],
//     }));
//   }, [data, colors]);

//   const total = useMemo(() => processed.reduce((s, x) => s + Number(x.value || 0), 0), [processed]);
//   const hasData = total > 0;

//   return (
//     <Card className="w-full">
//       <CardContent>
//         <motion.div
//           initial={{ opacity: 0, y: 6 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.35 }}
//           style={{ height }}
//           className="flex flex-col md:flex-row items-center gap-4 md:gap-6"
//         >
//           {/* Chart area */}
//           <div className="relative flex-1 min-w-[200px] max-w-[380px] w-full h-full">
//             <ResponsiveContainer width="100%" height="100%">
//               {hasData ? (
//                 <PieChart>
//                   <Pie
//                     data={processed}
//                     dataKey="value"
//                     nameKey="name"
//                     innerRadius="55%"
//                     outerRadius="85%"
//                     paddingAngle={3}
//                     labelLine={false}
//                     isAnimationActive={true}
//                     aria-label={ariaLabel}
//                   >
//                     {processed.map((entry, idx) => (
//                       <Cell key={`cell-${idx}`} fill={entry._color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               ) : (
//                 <div className="flex items-center justify-center h-full w-full bg-[rgb(var(--color-surface)/1)] rounded-md border border-[rgb(var(--color-border)/1)]">
//                   <div className="text-sm text-[rgb(var(--color-text-secondary)/1)]">No data to display</div>
//                 </div>
//               )}
//             </ResponsiveContainer>

//             {/* Center total overlay */}
//             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//               <span className="text-xs text-[rgb(var(--color-text-secondary)/1)]">Total</span>
//               <span className="text-lg font-semibold text-[rgb(var(--color-text-primary)/1)]">{totalValue}</span>
//             </div>
//           </div>

//           {/* Stats area */}
//           <div className="flex-1 w-full">
//             <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
//               {stats.length === 0 ? (
//                 processed.map((d) => (
//                   <div
//                     key={d.name}
//                     className="flex items-center justify-between flex-1 min-w-[120px]"
//                   >
//                     <div className="flex items-center gap-3">
//                       <span
//                         className="inline-block h-3 w-3 rounded-full"
//                         style={{ background: d._color }}
//                         aria-hidden
//                       />
//                       <div className="text-sm font-medium text-[rgb(var(--color-text-primary)/1)]">{d.name}</div>
//                     </div>
//                     <div className="text-sm text-[rgb(var(--color-text-secondary)/1)]">{d.value}</div>
//                   </div>
//                 ))
//               ) : (
//                 stats.map((s, idx) => (
//                   <div
//                     key={`${s.label}-${idx}`}
//                     className="flex items-center justify-between gap-4 flex-1 min-w-[120px]"
//                   >
//                     <div className="flex items-center gap-3">
//                       {s.icon ? (
//                         <s.icon className="h-5 w-5 text-[rgb(var(--color-text-secondary)/1)]" />
//                       ) : (
//                         <span
//                           className="inline-block h-3 w-3 rounded-full"
//                           style={{ background: processed[idx % processed.length]._color }}
//                           aria-hidden
//                         />
//                       )}
//                       <div className="flex flex-col">
//                         <span className="text-sm font-semibold text-[rgb(var(--color-text-primary)/1)]">{s.value}</span>
//                         <span className="text-xs text-[rgb(var(--color-text-secondary)/1)]">{s.label}</span>
//                       </div>
//                     </div>
//                     <div className="text-xs text-[rgb(var(--color-text-secondary)/1)]">
//                       {Math.round((Number(s.value) / (Number(total) || 1)) * 100)}%
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </CardContent>
//     </Card>
//   );
// };
