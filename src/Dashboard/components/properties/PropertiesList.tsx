// src/Dashboard/components/properties/PropertiesList.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BulkOperations } from "../common/BulkOperations";
import { UnitActionsDropdown } from "../units/UnitActionsDropdown";
import { TableFooter } from "../common/TableFooter";


interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  status: "active" | "inactive";
}

// Mock unit data for demonstration
const mockUnits = [
  { id: "1", code: "UNIT-101", status: "occupied", propertyId: "1" },
  { id: "2", code: "UNIT-102", status: "vacant", propertyId: "1" },
  { id: "3", code: "UNIT-201", status: "occupied", propertyId: "2" },
  { id: "4", code: "UNIT-202", status: "unavailable", propertyId: "2" },
];

export const PropertiesList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "1",
      name: "Sunset Apartments",
      address: "123 Main St, City, State 12345",
      type: "Apartment Building",
      units: 24,
      status: "active"
    },
    {
      id: "2",
      name: "Riverfront Condos",
      address: "456 River Rd, City, State 12345",
      type: "Condominium",
      units: 12,
      status: "active"
    }
  ]);

  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [filteredUnits] = useState(mockUnits); // In a real app, this would come from filters

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      setProperties(properties.filter(property => property.id !== id));
    }
  };

  const handleBulkStatusChange = (status: "vacant" | "occupied" | "unavailable" | "reserved") => {
    console.log(`Bulk status change to ${status} for units:`, selectedUnitIds);
    // Implement bulk status change logic here
    setSelectedUnitIds([]); // Clear selection after operation
  };

  const handleExport = () => {
    console.log("Export data");
    // Implement export logic here
  };

  const handlePrint = () => {
    console.log("Print data");
    // Implement print logic here
  };

  const handleClearSelection = () => {
    setSelectedUnitIds([]);
  };

  const handleResetFilters = () => {
    console.log("Reset filters");
    // Implement filter reset logic here
  };

  const toggleUnitSelection = (unitId: string) => {
    setSelectedUnitIds(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Manage Properties
        </h2>
      </div>

      {/* Bulk Operations Component */}
      <BulkOperations
        selectedCount={selectedUnitIds.length}
        onBulkStatusChange={handleBulkStatusChange}
        onExport={handleExport}
        onPrint={handlePrint}
        onClearSelection={handleClearSelection}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Select
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Units
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedUnitIds.includes(property.id)}
                    onChange={() => toggleUnitSelection(property.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {property.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {property.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {property.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {property.units}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    property.status === "active" 
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                      : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                  }`}>
                    {property.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    to={`edit/${property.id}`}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                  <UnitActionsDropdown unit={{ id: property.id, code: property.name, status: "active" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer Component */}
      <TableFooter
        filteredCount={properties.length}
        totalCount={properties.length}
        onExport={handleExport}
        onPrint={handlePrint}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};