// File: ui/date-picker.tsx
import * as React from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../util/cn";

interface DatePickerProps {
  mode?: "single" | "range";
  selected?: { from?: Date; to?: Date };
  onSelect?: (range: { from?: Date; to?: Date }) => void;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  mode = "single",
  selected,
  onSelect,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(selected?.from || new Date());
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    if (mode === "single") {
      onSelect?.({ from: date });
      setIsOpen(false);
    } else {
      if (!selected?.from || (selected.from && selected.to)) {
        onSelect?.({ from: date, to: undefined });
      } else if (selected.from && !selected.to) {
        if (date < selected.from) {
          onSelect?.({ from: date, to: selected.from });
        } else {
          onSelect?.({ from: selected.from, to: date });
        }
        setIsOpen(false);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selected?.from || !selected.to) return false;
    return date >= selected.from && date <= selected.to;
  };

  const isDateSelected = (date: Date) => {
    if (mode === "single") {
      return selected?.from?.toDateString() === date.toDateString();
    }
    return selected?.from?.toDateString() === date.toDateString() || 
           selected?.to?.toDateString() === date.toDateString();
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Previous month days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push(
        <button
          key={`prev-${i}`}
          className="text-gray-400 opacity-50 cursor-not-allowed"
          disabled
        >
          {prevMonthDays - i}
        </button>
      );
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isSelectedDate = isDateSelected(date);
      const isInRange = isDateInRange(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <button
          key={`current-${i}`}
          className={cn(
            "h-8 w-8 rounded-full text-sm transition-colors",
            isSelectedDate && "bg-primary text-white",
            isInRange && !isSelectedDate && "bg-primary/20",
            isToday && !isSelectedDate && "border border-primary",
            "hover:bg-primary/10"
          )}
          onClick={() => handleDateSelect(date)}
        >
          {i}
        </button>
      );
    }
    
    // Next month days
    const totalCells = 42; // 6 weeks * 7 days
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push(
        <button
          key={`next-${i}`}
          className="text-gray-400 opacity-50 cursor-not-allowed"
          disabled
        >
          {i}
        </button>
      );
    }
    
    return days;
  };

  const formatDateRange = () => {
    if (!selected?.from) return "Select date range";
    if (mode === "single") {
      return selected.from.toLocaleDateString();
    }
    if (!selected.to) {
      return `${selected.from.toLocaleDateString()} - Select end date`;
    }
    return `${selected.from.toLocaleDateString()} - ${selected.to.toLocaleDateString()}`;
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{formatDateRange()}</span>
        <Calendar className="h-4 w-4 opacity-50" />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-auto rounded-md border border-gray-200 bg-white p-4 shadow-md animate-in fade-in-80">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-medium">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};