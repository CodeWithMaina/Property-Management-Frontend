// FilterPanel.tsx - Updated with modal styling
import { X } from "lucide-react";
import type { FilterPanelProps } from "../../../types/unit.types";
import { formatCurrency } from "../../../util/typeConversion";

export const FilterPanel: React.FC<FilterPanelProps & { onClose: () => void }> = ({
  filterOptions,
  onFilterChange,
  onReset,
  onApply,
  properties,
  organizations,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
      <div 
        className="w-full max-w-md bg-white h-full overflow-y-auto transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="text-xl font-semibold">Filter Units</h2>
            <button 
              onClick={onClose}
              className="btn btn-ghost btn-circle btn-sm"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Organization Selector */}
              <div>
                <label className="label label-text p-0 mb-2 font-medium">Organization</label>
                <select
                  className="select select-bordered w-full"
                  value={filterOptions.organization || ""}
                  onChange={(e) =>
                    onFilterChange("organization", e.target.value || null)
                  }
                >
                  <option value="">All Organizations</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Dropdown */}
              <div>
                <label className="label label-text p-0 mb-2 font-medium">Property</label>
                <select
                  className="select select-bordered w-full"
                  value={filterOptions.property || ""}
                  onChange={(e) => onFilterChange("property", e.target.value || null)}
                  disabled={!filterOptions.organization && organizations.length > 0}
                >
                  <option value="">All Properties</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Multi-Select */}
              <div>
                <label className="label label-text p-0 mb-2 font-medium">Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["vacant", "occupied", "unavailable", "reserved"] as const).map(
                    (status) => (
                      <label
                        key={status}
                        className="cursor-pointer flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={filterOptions.status.includes(status)}
                          onChange={(e) => {
                            const newStatus = e.target.checked
                              ? [...filterOptions.status, status]
                              : filterOptions.status.filter((s) => s !== status);
                            onFilterChange("status", newStatus);
                          }}
                        />
                        <span className="label-text font-medium capitalize">
                          {status}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Rent Range Slider */}
              <div>
                <label className="label label-text p-0 mb-2 font-medium">
                  Rent Range: {formatCurrency(filterOptions.rent[0].toString())} -{" "}
                  {formatCurrency(filterOptions.rent[1].toString())}
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filterOptions.rent[0]}
                      onChange={(e) =>
                        onFilterChange("rent", [
                          parseInt(e.target.value),
                          filterOptions.rent[1],
                        ])
                      }
                      className="range range-sm"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filterOptions.rent[1]}
                      onChange={(e) =>
                        onFilterChange("rent", [
                          filterOptions.rent[0],
                          parseInt(e.target.value),
                        ])
                      }
                      className="range range-sm"
                    />
                  </div>
                  <div className="flex justify-between text-sm px-2 text-gray-600">
                    <span>{formatCurrency("0")}</span>
                    <span>{formatCurrency("50000")}</span>
                    <span>{formatCurrency("100000")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-3 pt-6 mt-6 border-t">
            <button 
              className="btn btn-outline flex-1" 
              onClick={onReset}
            >
              Reset Filters
            </button>
            <button 
              className="btn btn-primary flex-1" 
              onClick={() => {
                onApply();
                onClose();
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};