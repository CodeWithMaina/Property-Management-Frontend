import React, { type ReactNode, useCallback, useState } from "react";
import { motion } from "framer-motion";
import type { LucideProps } from "lucide-react";
import { Loader2 } from "lucide-react";

/**
 * A Lucide icon component type
 */
export type LucideIcon = React.FC<LucideProps>;

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
 * Base classes
 */
const baseClass =
  "relative inline-flex items-center justify-center gap-2 rounded-2xl font-semibold select-none transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const sizeMap: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const variantMap: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:shadow-md hover:brightness-[0.97] active:scale-[0.985] focus-visible:ring-primary/40",
  ghost:
    "bg-transparent text-text-primary hover:bg-surface/70 active:scale-[0.985]",
  outline:
    "bg-surface text-text-primary border border-border hover:bg-surface/80 active:scale-[0.985]",
  danger:
    "bg-[rgb(var(--color-error)/1)] text-white shadow-sm hover:shadow-md hover:brightness-95 active:scale-[0.985] focus-visible:ring-[rgb(var(--color-error)/0.4)]",
  success:
    "bg-[rgb(var(--color-success)/1)] text-white shadow-sm hover:shadow-md hover:brightness-95 active:scale-[0.985] focus-visible:ring-[rgb(var(--color-success)/0.4)]",
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
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      initial={false}
      onClick={handleClick}
      type={type}
      aria-busy={loading}
      aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
      disabled={isDisabled}
      className={`${baseClass} ${sizeClass} ${variantClass} ${className}`}
    >
      {/* Shimmer overlay when loading */}
      {loading && (
        <span
          className="absolute inset-0 rounded-2xl overflow-hidden opacity-40"
          aria-hidden
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
        </span>
      )}

      {/* Left Icon or Loader */}
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0 z-10" aria-hidden />
      ) : (
        LeftIcon && <LeftIcon className="h-4 w-4 shrink-0 z-10" aria-hidden />
      )}

      {/* Label */}
      <span className="truncate z-10">{children ?? title}</span>

      {/* Right Icon */}
      {!loading && RightIcon ? (
        <RightIcon className="h-4 w-4 shrink-0 z-10" aria-hidden />
      ) : null}
    </motion.button>
  );
};

export default Button;

/* =====================================================
   Usage examples:
   <Button title="Save" onAction={handleSave} leftIcon={Check} variant="success" />
   <Button title="Delete" onAction={handleDelete} leftIcon={Trash} variant="danger" />
   <Button title="Outline Button" variant="outline" />
===================================================== */
