import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type {
  CreateAmenityProps,
  TAmenityApiResponse,
  TAmenityInput,
} from "../../../types/amenity.types";
import { useGetOrganizationsQuery } from "../../../redux/endpoints/organizationApi";
import {
  useCheckAmenityNameAvailabilityQuery,
  useCreateAmenityMutation,
} from "../../../redux/endpoints/amenityApi";
import {
  createAmenitySchema,
  type CreateAmenityFormData,
} from "../../../validation/amenity.schema";
import type { TOrganization } from "../../../types/organization.types";
import Button from "../ui/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ChevronDown, Check, X, Search } from "lucide-react";

/**
 * Form layout helpers
 */
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-xl mx-auto my-8 p-6">{children}</div>
);

/**
 * Generic small helper used for labeled controls
 */
const FormControl: React.FC<{
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ label, error, helperText, required, children, disabled }) => (
  <div className={`flex flex-col gap-2 ${disabled ? "opacity-60" : ""}`}>
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
    </div>
    {children}
    {(error || helperText) && (
      <p className={`text-xs ${error ? "text-error" : "text-gray-500"}`}>
        {error || helperText}
      </p>
    )}
  </div>
);

/**
 * Animated, accessible custom select used for organization selection.
 * - keyboard navigable
 * - filterable
 * - animated open/close
 */
const AnimatedSelect: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: TOrganization[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}> = ({
  value,
  onChange,
  options,
  placeholder = "Choose...",
  disabled,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      (o.name + " " + (o.legalName || "")).toLowerCase().includes(q)
    );
  }, [options, query]);

  const selected = options.find((o) => o.id === value);

  return (
    <div ref={containerRef} className={`relative`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((s) => !s)}
        className={`w-full text-left border rounded-lg px-3 py-2 flex items-center justify-between gap-3 ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        } ${error ? "border-red-300" : "border-gray-200"}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-sm text-gray-900">
              {selected ? selected.name : placeholder}
            </span>
            {selected?.legalName && (
              <span className="text-xs text-gray-500">
                {selected.legalName}
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Animated panel */}
      <div
        role="listbox"
        aria-hidden={!open}
        className={`absolute z-50 mt-2 left-0 right-0 bg-white border rounded-lg shadow-lg transform origin-top transition-all duration-200 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-2">
          <div className="flex items-center gap-2 px-2 py-1 border rounded-md">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter organizations..."
              className="w-full text-sm outline-none bg-transparent"
              aria-label="Filter organizations"
            />
            {query && (
              <Button
                onAction={() => setQuery("")}
                aria-label="Clear"
                className="p-1"
              >
                <X size={14} />
              </Button>
            )}
          </div>

          <div className="max-h-56 overflow-y-auto mt-2 space-y-1">
            {filtered.length === 0 && (
              <div className="p-3 text-sm text-gray-500">
                No organizations match
              </div>
            )}

            {filtered.map((org) => (
              <button
                key={org.id}
                role="option"
                aria-selected={org.id === value}
                onClick={() => {
                  onChange(org.id);
                  setOpen(false);
                  setQuery("");
                }}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between gap-2 hover:bg-gray-50 ${
                  org.id === value ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="text-sm text-gray-800">{org.name}</span>
                  {org.legalName && (
                    <span className="text-xs text-gray-500">
                      {org.legalName}
                    </span>
                  )}
                </div>
                {org.id === value && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * CreateAmenity component: Redesigned with react-hot-toast feedback
 */
export const CreateAmenity: React.FC<CreateAmenityProps> = ({
  preselectedOrganizationId,
  onSuccess,
  onCancel,
  defaultValues,
  showOrganizationSelector = true,
}) => {
  // Navigation hook for redirect
  const navigate = useNavigate();

  // API hooks
  const [
    createAmenity,
    { isLoading: isCreating, reset: resetCreation },
  ] = useCreateAmenityMutation();
  const {
    data: organizationsData,
    isLoading: isLoadingOrgs,
    error: orgsError,
  } = useGetOrganizationsQuery({ isActive: true, page: 1, limit: 100 });

  // Name availability state (used for form feedback)
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);

  // react-hook-form setup
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
    setError,
    clearErrors,
    setValue,
    reset,
  } = useForm<CreateAmenityFormData>({
    resolver: zodResolver(createAmenitySchema),
    defaultValues: {
      organizationId: preselectedOrganizationId || "",
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
    },
    mode: "onChange",
  });

  const watchedName = watch("name");
  const watchedOrganizationId = watch("organizationId");

  // Show toast for organization loading error
  useEffect(() => {
    if (orgsError) {
      toast.error("Failed to load organizations. Please try again later.", {
        id: "orgs-load-error",
      });
    }
  }, [orgsError]);

  // If only one org is available and not preselected, auto-select it
  useEffect(() => {
    if (
      organizationsData?.data &&
      organizationsData.data.length === 1 &&
      !preselectedOrganizationId
    ) {
      setValue("organizationId", organizationsData.data[0].id);
      toast.success(`Auto-selected organization: ${organizationsData.data[0].name}`, {
        id: "auto-select-org",
        duration: 3000,
      });
    }
  }, [organizationsData, preselectedOrganizationId, setValue]);

  // Check name availability (uses existing RTK Query hook). We skip checks for short names.
  const { data: availabilityData, isLoading: checkingAvailability } =
    useCheckAmenityNameAvailabilityQuery(
      { organizationId: watchedOrganizationId, name: watchedName },
      {
        skip: !watchedName || watchedName.length < 2 || !watchedOrganizationId,
        refetchOnMountOrArgChange: true,
      }
    );

  useEffect(() => {
    if (availabilityData) {
      setNameAvailable(availabilityData.available);

      if (!availabilityData.available && watchedName) {
        setError("name", {
          type: "manual",
          message: availabilityData.suggestion
            ? `Name not available. Try: ${availabilityData.suggestion}`
            : "This amenity name already exists in the selected organization",
        });
        
        // Show toast for name conflict
        toast.error(
          availabilityData.suggestion 
            ? `Name taken. Suggestion: ${availabilityData.suggestion}`
            : "Amenity name already exists in this organization",
          {
            id: `name-conflict-${watchedName}`,
            duration: 5000,
          }
        );
      } else {
        clearErrors("name");
        
        // Show success toast when name becomes available
        if (availabilityData.available && watchedName.length >= 2) {
          toast.success("Amenity name is available!", {
            id: `name-available-${watchedName}`,
            duration: 3000,
          });
        }
      }
    }
  }, [availabilityData, watchedName, setError, clearErrors]);

  /**
   * Helper for name field helper text
   */
  const getNameHelperText = () => {
    if (!watchedOrganizationId) return "Select an organization first";
    if (checkingAvailability) return "Checking availability...";
    if (nameAvailable === true) return "Name is available!";
    if (nameAvailable === false)
      return "Name already exists in this organization";
    return "Enter a unique name for your amenity (min. 2 characters)";
  };

  /**
   * Name input color helper
   */
  const getNameColor = () => {
    if (!watchedOrganizationId) return "";
    if (checkingAvailability) return "border-blue-200";
    if (nameAvailable === true) return "border-green-300";
    if (nameAvailable === false) return "border-red-300";
    return "";
  };

  const canSubmit = () => {
    return (
      !isCreating &&
      isValid &&
      isDirty &&
      nameAvailable !== false &&
      !!watchedOrganizationId
    );
  };

  const onSubmit = async (data: CreateAmenityFormData) => {
    if (!isValid) return;

    const toastId = toast.loading("Creating amenity...");
    
    try {
      resetCreation();

      const amenityData: TAmenityInput = {
        organizationId: data.organizationId,
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
      };

      const result = await createAmenity(amenityData).unwrap();

      // Reset form
      reset({
        organizationId: preselectedOrganizationId || "",
        name: "",
        description: "",
      });
      setNameAvailable(null);

      // Success toast
      toast.success(`Amenity "${data.name}" created successfully!`, {
        id: toastId,
        duration: 5000,
      });

      // Redirect to amenities list after successful creation
      navigate("/admin/amenities/list");

      if (onSuccess) onSuccess(result);
    } catch (err) {
      // Error toast
      let errorMessage = "Failed to create amenity";
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        (err as { data?: TAmenityApiResponse }).data &&
        typeof (err as { data: TAmenityApiResponse }).data.message === "string"
      ) {
        errorMessage = (err as { data: TAmenityApiResponse }).data.message ?? "Failed to create amenity";
      }
      
      toast.error(errorMessage, {
        id: toastId,
        duration: 6000,
      });
      
      console.error("Create amenity failed", err);
    }
  };

  // Show loading state for organizations
  if (isLoadingOrgs) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card>
          <div className="flex flex-col items-center gap-4 py-8">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600">Loading organizations...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-6">
            <header className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Amenity
              </h1>
              <p className="text-sm text-gray-500">
                Quickly add amenities and assign them to units. Keep names
                unique per organization.
              </p>
            </header>

            {/* Organization Selector */}
            {showOrganizationSelector && (
              <Controller
                name="organizationId"
                control={control}
                render={({ field }) => (
                  <FormControl
                    label="Organization"
                    error={errors.organizationId?.message}
                    helperText="Select the organization for this amenity"
                    required
                    disabled={!!preselectedOrganizationId}
                  >
                    <AnimatedSelect
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                      options={organizationsData?.data || []}
                      placeholder="Select an organization"
                      disabled={!!preselectedOrganizationId}
                      error={!!errors.organizationId}
                    />
                  </FormControl>
                )}
              />
            )}

            {/* Name field */}
            <FormControl
              label="Amenity Name"
              error={errors.name?.message}
              helperText={getNameHelperText()}
              required
              disabled={isCreating || !watchedOrganizationId}
            >
              <div className="relative">
                <input
                  {...register("name")}
                  type="text"
                  placeholder="e.g., Swimming Pool, Gym"
                  className={`w-full px-3 py-2 border rounded-md outline-none transition-colors ${getNameColor()} ${
                    errors.name ? "border-red-300" : "border-gray-200"
                  }`}
                  disabled={isCreating || !watchedOrganizationId}
                />
                {checkingAvailability && (
                  <div className="absolute right-3 top-3">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
                {nameAvailable === true && !checkingAvailability && (
                  <div className="absolute right-3 top-3 text-green-500">
                    <Check size={16} />
                  </div>
                )}
              </div>
            </FormControl>

            {/* Description */}
            <FormControl
              label="Description"
              error={errors.description?.message}
              helperText="Optional — max 500 chars"
              disabled={isCreating}
            >
              <textarea
                {...register("description")}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md resize-none transition-colors ${
                  errors.description ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Optional description"
                disabled={isCreating}
              />
            </FormControl>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              {onCancel && (
                <Button
                  variant="primary"
                  onAction={onCancel}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={!canSubmit()}
                loading={isCreating}
                className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCreating ? "Creating ..." : "Create Amenity"}
              </Button>
            </div>

            {/* Status bar */}
            <div className="text-xs text-gray-500">
              {!watchedOrganizationId && "Select an organization to continue."}
              {watchedOrganizationId &&
                !isDirty &&
                "Fill in the form to create a new amenity."}
              {watchedOrganizationId &&
                isDirty &&
                !isValid &&
                "Please fix the errors above."}
              {watchedOrganizationId && isDirty && isValid && "Form is ready to submit!"}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateAmenity;