import type { ReactNode } from "react";
import { motion } from "framer-motion";

export type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  role?: string;
  padding?: CardPadding;
}

/**
 * Dashboard Card Component
 * - Animated entry
 * - White background for professional dashboard look
 * - Rounded corners + shadow
 * - Optional hover elevation
 */
const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  role,
  hover = true,
  padding = "md",
}) => {
  const paddingClasses: Record<CardPadding, string> = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      role={role}
      className={`
        bg-white 
        rounded-2xl 
        shadow-sm 
        border border-gray-200 
        transition-all duration-200
        ${hover ? "hover:shadow-md" : ""}
        ${paddingClasses[padding]}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.article>
  );
};

export default Card;
