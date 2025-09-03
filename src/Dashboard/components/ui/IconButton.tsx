import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideProps } from "lucide-react";
import { Loader2 } from "lucide-react";

/**
 * Lucide icon type
 */
export type LucideIcon = React.FC<LucideProps>;

export type IconButtonProps = {
  icon: LucideIcon;
  label: string; // accessible label + tooltip text
  onAction?: () => void | Promise<void>;
  variant?: "primary" | "ghost" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

/**
 * Base button classes (shared style with Button.tsx)
 */
const baseClass =
  "relative inline-flex items-center justify-center rounded-xl transition-[background,transform,opacity] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const sizeMap: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "p-2 h-8 w-8 text-sm",
  md: "p-2.5 h-10 w-10 text-base",
  lg: "p-3 h-12 w-12 text-lg",
};

const variantMap: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white hover:brightness-95 active:scale-[0.97] focus:ring-primary/40",
  ghost:
    "bg-transparent text-text-primary hover:bg-surface/60 active:scale-[0.97]",
  outline:
    "bg-surface text-text-primary border border-border hover:bg-surface/80 active:scale-[0.97]",
  danger:
    "bg-[rgb(var(--color-error)/1)] text-white hover:brightness-95 active:scale-[0.97]",
  success:
    "bg-[rgb(var(--color-success)/1)] text-white hover:brightness-95 active:scale-[0.97]",
};

/**
 * IconButton component
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  onAction,
  variant = "ghost",
  size = "md",
  className = "",
  loading: externalLoading,
  disabled = false,
  type = "button",
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [hover, setHover] = useState(false);

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
    <div className="relative inline-block">
      <motion.button
        whileTap={{ scale: isDisabled ? 1 : 0.95 }}
        type={type}
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label={label}
        disabled={isDisabled}
        className={`${baseClass} ${sizeClass} ${variantClass} ${className}`}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        ) : (
          <Icon className="h-5 w-5" aria-hidden />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded-md bg-surface text-text-primary shadow-lg whitespace-nowrap z-10"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IconButton;
// ==========================================
// Example usage:
        // <IconButton icon={Check} label="Save" variant="success" onAction={handleSave} />
        // <IconButton icon={Trash} label="Delete" variant="danger" onAction={handleDelete} />
        // <IconButton icon={Edit} label="Edit" variant="ghost" onAction={() => toast("Edit")} />
// ==========================================
