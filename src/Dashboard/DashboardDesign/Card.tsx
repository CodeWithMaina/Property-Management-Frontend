import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({ children, className = "", padding = "md" }) => {
  const paddingClasses = {
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <article 
      className={`bg-black rounded-lg shadow-md h-full overflow-hidden ${
        paddingClasses[padding]
      } ${className}`}
    >
      {children}
    </article>
  );
};

export default Card;