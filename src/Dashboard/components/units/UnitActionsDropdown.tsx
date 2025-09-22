import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDeleteUnitMutation } from "../../../redux/endpoints/unitApi";
import type { UnitActionsDropdownProps } from "../../../types/unit.types";

export const UnitActionsDropdown: React.FC<UnitActionsDropdownProps> = ({ unit }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [deleteUnit] = useDeleteUnitMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete unit ${unit.code}? This action cannot be undone.`)) {
      try {
        await deleteUnit(unit.id).unwrap();
        toast.success(`Unit ${unit.code} deleted successfully`);
        setOpen(false);
        // Refresh the page after deletion
        window.location.reload();
      } catch (error) {
        toast.error(`Failed to delete unit: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleViewDetails = () => {
    navigate(`/admin/units/display/${unit.id}`);
    setOpen(false);
  };

  const handleEdit = () => {
    navigate(`/admin/units/edit/${unit.id}`);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="btn btn-ghost btn-xs flex items-center justify-center"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-md border border-gray-200 bg-base-100 shadow-lg z-50">
          <ul className="py-1 text-sm">
            <li>
              <button
                onClick={handleViewDetails}
                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </li>
            <li>
              <button
                onClick={handleEdit}
                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
                Edit Unit
              </button>
            </li>
            <li>
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Unit
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};