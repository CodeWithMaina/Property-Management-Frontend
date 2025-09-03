import React, { type ReactNode, useCallback, useState } from "react";
import { motion } from "framer-motion";
import type { LucideProps } from "lucide-react";
import { Loader2 } from "lucide-react";

/**
 * A Lucide icon component type
 * (all icons from lucide-react conform to this signature).
 */
export type LucideIcon = React.FC<LucideProps>;

/**
 * Props for the Button component
 *
 * - `title` - fallback text if children not provided
 * - `onAction` - function supplied by parent to run when clicked (sync or async)
 * - `variant` - visual style preset
 * - `size` - button size
 * - `leftIcon` / `rightIcon` - optional Lucide icon components
 * - `className` - extra tailwind classes from parent
 * - `loading` - externally controlled loading state
 * - `disabled` - disable the button
 * - `type` - HTML button type (button | submit | reset)
 */
export type ButtonProps = {
  title?: string;
  onAction?: () => void | Promise<void>;
  variant?: "primary" | "ghost" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  leftIcon?: LucideIcon | null;
  rightIcon?: LucideIcon | null;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  "aria-label"?: string;
};

/**
 * Base classes — mobile-first, semantic tokens used
 */
const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold select-none transition-[box-shadow,transform,opacity] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const sizeMap: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const variantMap: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:brightness-95 active:scale-[0.995] focus:ring-primary/40",
  ghost:
    "bg-transparent text-text-primary hover:bg-surface/60 active:scale-[0.995] border-transparent",
  outline:
    "bg-surface text-text-primary border border-border hover:bg-surface/80 active:scale-[0.995]",
  danger:
    "bg-[rgb(var(--color-error)/1)] text-white shadow-sm hover:brightness-95 active:scale-[0.995]",
  success:
    "bg-[rgb(var(--color-success)/1)] text-white shadow-sm hover:brightness-95 active:scale-[0.995]",
};

/**
 * Button component
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  children,
  onAction,
  variant = "primary",
  size = "md",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  loading: externalLoading,
  disabled = false,
  type = "button",
  "aria-label": ariaLabel,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const loading = externalLoading ?? internalLoading;
  const isDisabled = disabled || loading;

  const handleClick = useCallback(async () => {
    if (isDisabled) return;

    try {
      const maybePromise = onAction?.();
      if (maybePromise && typeof (maybePromise as Promise<void>).then === "function") {
        if (externalLoading === undefined) setInternalLoading(true);
        await (maybePromise as Promise<void>);
      }
    } finally {
      if (externalLoading === undefined) setInternalLoading(false);
    }
  }, [onAction, isDisabled, externalLoading]);

  const sizeClass = sizeMap[size];
  const variantClass = variantMap[variant];

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.985 }}
      initial={false}
      onClick={handleClick}
      type={type}
      aria-busy={loading}
      aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
      disabled={isDisabled}
      className={`${baseClass} ${sizeClass} ${variantClass} ${className}`}
    >
      {/* Loading spinner */}
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <>
          {LeftIcon ? <LeftIcon className="h-4 w-4" aria-hidden /> : null}
        </>
      )}

      <span className="truncate">{children ?? title}</span>

      {!loading && RightIcon ? <RightIcon className="h-4 w-4" aria-hidden /> : null}
    </motion.button>
  );
};

export default Button;
//==========================================
      // <Button title="Save" onAction={handleSave} leftIcon={Check} variant="success" />
      // <Button title="Delete" onAction={handleDelete} leftIcon={Trash} variant="danger" />
      // <Button title="Outline Button" variant="outline" /> 
//==========================================
