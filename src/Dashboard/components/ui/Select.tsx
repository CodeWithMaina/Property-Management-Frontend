// File: ui/select.tsx
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../util/cn";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  children,
  className,
  disabled
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node) &&
        contentRef.current && 
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              ref: triggerRef,
              onClick: () => !disabled && setIsOpen(!isOpen),
              "aria-expanded": isOpen,
              disabled
            });
          }
        }
        return null;
      })}
      
      {isOpen && (
        <div
          ref={contentRef}
          className="absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-80"
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectContent) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onSelect: handleSelect,
                currentValue: value
              });
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  }
);

SelectTrigger.displayName = "SelectTrigger";

export const SelectContent: React.FC<SelectContentProps & { onSelect?: (value: string) => void; currentValue?: string }> = ({
  children,
  className,
  onSelect,
  currentValue
}) => {
  return (
    <div className={cn("p-1", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(
            child as React.ReactElement<SelectItemProps & { isSelected?: boolean; onSelect?: () => void }>,
            {
              isSelected: (child.props as SelectItemProps).value === currentValue,
              onSelect: () => onSelect?.((child.props as SelectItemProps).value)
            }
          );
        }
        return child;
      })}
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps & { isSelected?: boolean; onSelect?: () => void }> = ({
  children,
  className,
  isSelected,
  onSelect
}) => {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none transition-colors",
        isSelected ? "bg-gray-100 text-gray-900" : "hover:bg-gray-100",
        className
      )}
      onClick={onSelect}
    >
      {children}
    </div>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  return <span className="text-left">{placeholder}</span>;
};