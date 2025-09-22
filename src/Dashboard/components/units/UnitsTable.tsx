import { Building, Calendar, DollarSign, Home, User } from "lucide-react";
import { UnitActionsDropdown } from "./UnitActionsDropdown";
import type { UnitsTableProps } from "../../../types/unit.types";
import { formatCurrency, getStatusColor } from "../../../util/typeConversion";



export const UnitsTable: React.FC<UnitsTableProps> = ({
  units,
  selectedUnits,
  onToggleUnitSelection,
  onToggleSelectAll,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="table table-zebra w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3">
              <label>
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={
                    selectedUnits.length === units.length && units.length > 0
                  }
                  onChange={onToggleSelectAll}
                />
              </label>
            </th>
            <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit
            </th>
            <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property
            </th>
            <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rent
            </th>
            <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tenant
            </th>
            <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lease End
            </th>
            <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {units.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-8 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <Building className="h-12 w-12 text-gray-300 mb-2" />
                  <p>No units found matching your filters.</p>
                </div>
              </td>
            </tr>
          ) : (
            units.map((unit) => {
              const activeLease = unit.leases.find(
                (lease) => lease.status === "active"
              );
              const tenant = activeLease?.tenant;

              return (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs"
                        checked={selectedUnits.includes(unit.id)}
                        onChange={() => onToggleUnitSelection(unit.id)}
                      />
                    </label>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{unit.code}</div>
                    <div className="text-xs text-gray-500">
                      {unit.bedrooms} bed, {unit.bathrooms} bath, {unit.sizeSqm}{" "}
                      m²
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-sm block">
                          {unit.property.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {unit.property.organization.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`badge badge-sm border ${getStatusColor(
                        unit.status
                      )} capitalize`}
                    >
                      {unit.status}
                    </span>
                    {unit.status === "unavailable" &&
                      unit.metadata &&
                      (unit.metadata as { statusChange?: { reason: string } })
                        .statusChange && (
                        <div className="text-xs text-gray-500 mt-1">
                          {
                            (
                              unit.metadata as {
                                statusChange: { reason: string };
                              }
                            ).statusChange.reason
                          }
                        </div>
                      )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-gray-500" />
                      <span className="font-medium">
                        {formatCurrency(unit.baseRent)}
                      </span>
                      <span className="text-xs text-gray-500">/mo</span>
                    </div>
                  </td>
                  <td className="p-3">
                    {tenant ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-sm block">
                            {tenant.fullName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {tenant.email}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    {activeLease?.endDate ? ( // Check if endDate exists before using it
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(activeLease.endDate).toLocaleDateString()}{" "}
                          {/* Now safe */}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <UnitActionsDropdown unit={unit} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};