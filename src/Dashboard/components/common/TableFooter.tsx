import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";
import type { TableFooterProps } from "../../../types/unit.types";

export const TableFooter: React.FC<TableFooterProps> = ({
  filteredCount,
  totalCount,
  currentPage = 1,        // fallback default
  pageSize = 10,          // fallback default
  onPageChange,
  onPageSizeChange,
  onExport,
  onPrint,
  onResetFilters,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      {/* Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing <span className="font-semibold">{filteredCount}</span> of{" "}
        <span className="font-semibold">{totalCount}</span> units
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Rows per page */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="select select-bordered select-sm"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pagination */}
        {onPageChange && (
          <div className="flex items-center gap-2">
            <button
              className="btn btn-sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm">
              Page <span className="font-semibold">{currentPage}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </span>

            <button
              className="btn btn-sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Export / Print / Reset */}
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
          <button className="btn btn-outline btn-sm" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </button>
          {filteredCount < totalCount && (
            <button className="btn btn-ghost btn-sm" onClick={onResetFilters}>
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
