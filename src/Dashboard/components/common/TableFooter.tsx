import { Download, Printer } from "lucide-react";
import type { TableFooterProps } from "../../../types/unit.types";

export const TableFooter: React.FC<TableFooterProps> = ({
  filteredCount,
  totalCount,
  onExport,
  onPrint,
  onResetFilters,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-gray-500">
        Showing {filteredCount} of {totalCount} units
      </div>
      <div className="flex gap-2">
        <button className="btn btn-outline btn-sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </button>
        <button className="btn btn-outline btn-sm" onClick={onPrint}>
          <Printer className="h-4 w-4 mr-1" />
          Print Labels
        </button>
        {filteredCount < totalCount && (
          <button className="btn btn-ghost btn-sm" onClick={onResetFilters}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};