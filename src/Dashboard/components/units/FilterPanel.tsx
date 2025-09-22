import { X } from "lucide-react";
import type { FilterPanelProps } from "../../../types/unit.types";
import { formatCurrency } from "../../../util/typeConversion";

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filterOptions,
  onFilterChange,
  onReset,
  onApply,
  properties,
  organizations,
}) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Organization Selector */}
        <div>
          <label className="label label-text p-0 mb-1">Organization</label>
          <select
            className="select select-bordered w-full select-sm"
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
          <label className="label label-text p-0 mb-1">Property</label>
          <select
            className="select select-bordered w-full select-sm"
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
          <label className="label label-text p-0 mb-1">Status</label>
          <div className="flex flex-wrap gap-2">
            {(["vacant", "occupied", "unavailable", "reserved"] as const).map(
              (status) => (
                <label
                  key={status}
                  className="cursor-pointer label justify-start gap-2 p-0"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    checked={filterOptions.status.includes(status)}
                    onChange={(e) => {
                      const newStatus = e.target.checked
                        ? [...filterOptions.status, status]
                        : filterOptions.status.filter((s) => s !== status);
                      onFilterChange("status", newStatus);
                    }}
                  />
                  <span className="label-text text-xs capitalize">
                    {status}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Rent Range Slider */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="label label-text p-0 mb-1">
            Rent Range: {formatCurrency(filterOptions.rent[0].toString())} -{" "}
            {formatCurrency(filterOptions.rent[1].toString())}
          </label>
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
              className="range range-xs"
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
              className="range range-xs"
            />
          </div>
          <div className="flex justify-between text-xs px-2 mt-1 text-gray-500">
            <span>{formatCurrency("0")}</span>
            <span>{formatCurrency("50000")}</span>
            <span>{formatCurrency("100000")}</span>
          </div>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex justify-end mt-4 gap-2">
        <button className="btn btn-ghost btn-sm" onClick={onReset}>
          <X className="h-4 w-4 mr-1" />
          Reset
        </button>
        <button className="btn btn-primary btn-sm" onClick={onApply}>
          Apply
        </button>
      </div>
    </div>
  );
};