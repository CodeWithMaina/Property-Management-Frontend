// Card.tsx
import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = "", 
  padding = "md", 
  hover = false,
  onClick
}) => {
  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`bg-surface rounded-lg shadow-xs border border-border h-full overflow-hidden 
        ${paddingClasses[padding]} 
        ${hover ? "hover:shadow-sm transition-all duration-200 cursor-pointer" : ""}
        ${className}`}
    >
      {children}
    </motion.article>
  );
};

export default Card;