// src/Dashboard/components/organizations/OrganizationFilter.tsx
import React from 'react';
import { X } from 'lucide-react';
import type { TOrganizationQueryParams } from '../../../types/organization.types';

interface OrganizationFilterProps {
  queryParams: TOrganizationQueryParams;
  setQueryParams: (params: TOrganizationQueryParams) => void;
  onClose: () => void;
}

export const OrganizationFilter: React.FC<OrganizationFilterProps> = ({
  queryParams,
  setQueryParams,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter Organizations
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={queryParams.isActive?.toString() || ''}
              onChange={(e) => setQueryParams({
                ...queryParams,
                isActive: e.target.value === '' ? undefined : e.target.value === 'true'
              })}
              className="select select-bordered w-full"
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setQueryParams({
                page: 1,
                limit: 10,
                search: queryParams.search || '',
              });
            }}
            className="btn btn-ghost"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};