// Updated SearchBar component without search button
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { SearchBarProps } from "../../../types/common.types";

type FormValues = {
  search: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onSearchChange,
  onSearchAction,
  onToggleFilters,
  showFilters,
  placeholder = "Search amenities by name, description, or organization...",
}) => {
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: { search: searchValue || "" },
  });

  const search = watch("search");

  // 🔹 Debounced live search for real-time filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(search.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [search, onSearchChange]);

  const handleClear = () => {
    setValue("search", "");
    onSearchChange("");
  };

  // 🔹 Handle Enter key press for API search fallback
  const onSubmit = (data: FormValues) => {
    const trimmedSearch = data.search.trim();
    
    if (onSearchAction) {
      onSearchAction(trimmedSearch);
    }
  };

  // 🔹 Handle key down for Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col md:flex-row gap-3 items-stretch w-full"
    >
      {/* Search Input Group */}
      <div className="flex flex-grow rounded-xl border border-gray-300 overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition">
        {/* Search Icon */}
        <div className="flex items-center justify-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        {/* Search Input */}
        <input
          type="text"
          placeholder={placeholder}
          className="flex-grow px-3 py-2 text-sm border-0 focus:ring-0 focus:outline-none"
          {...register("search")}
          onKeyDown={handleKeyDown}
        />
        
        {/* Clear Button */}
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center pr-3 text-gray-400 hover:text-red-500 transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Button Only */}
      <div className="flex gap-2">
        <button
          onClick={onToggleFilters}
          type="button"
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 transition min-w-[100px] ${
            showFilters 
              ? "border-indigo-400 bg-indigo-50 text-indigo-600" 
              : "border-gray-300 bg-white text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {showFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
};