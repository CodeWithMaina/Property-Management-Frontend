import { ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import type { SearchBarProps } from "../../../types/common.types";

export const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onSearchChange,
  onToggleFilters,
  showFilters,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search units, properties, or tenants..."
          className="input input-bordered w-full pl-10 input-sm"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button className="btn btn-outline btn-sm" onClick={onToggleFilters}>
        <Filter className="h-4 w-4 mr-1" />
        Filters
        {showFilters ? (
          <ChevronUp className="h-4 w-4 ml-1" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-1" />
        )}
      </button>
    </div>
  );
};