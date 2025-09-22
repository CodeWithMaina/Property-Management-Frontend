import { Download, Printer, X } from "lucide-react";
import type { BulkOperationsProps } from "../../../types/unit.types";

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedCount,
  onBulkStatusChange,
  onExport,
  onPrint,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-4 flex flex-wrap items-center gap-3 border border-blue-200">
      <span className="font-medium text-sm">
        {selectedCount} units selected
      </span>
      <div className="flex flex-wrap gap-2">
        <select
          className="select select-bordered select-xs"
          onChange={(e) =>
            onBulkStatusChange(
              e.target.value as
                | "vacant"
                | "occupied"
                | "unavailable"
                | "reserved"
            )
          }
          defaultValue=""
        >
          <option value="" disabled>
            Change Status
          </option>
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
          <option value="unavailable">Unavailable</option>
          <option value="reserved">Reserved</option>
        </select>
        <button
          className="btn btn-sm btn-ghost text-blue-800"
          onClick={onExport}
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </button>
        <button
          className="btn btn-sm btn-ghost text-blue-800"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4 mr-1" />
          Print
        </button>
      </div>
      <button
        className="btn btn-ghost btn-sm ml-auto text-blue-800"
        onClick={onClearSelection}
      >
        <X className="h-4 w-4" />
        Clear
      </button>
    </div>
  );
};