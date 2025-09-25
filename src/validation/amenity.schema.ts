import z from "zod";

/**
 * Validation schema for creating a new amenity
 * Includes organization selection validation
 */
export const createAmenitySchema = z.object({
  organizationId: z
    .string()
    .uuid("Please select a valid organization")
    .min(1, "Organization selection is required"),
  name: z
    .string()
    .min(1, "Amenity name is required")
    .max(128, "Amenity name must be less than 128 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Amenity name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

// Zod validation schema for amenity update
export const updateAmenitySchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(128, "Name must be less than 128 characters")
      .regex(
        /^[a-zA-Z0-9\s\-_]+$/,
        "Name can only contain letters, numbers, spaces, hyphens, and underscores"
      )
      .optional(),
    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional()
      .or(z.literal("")),
    organizationId: z.string().uuid("Invalid organization ID").optional(),
  })
  .refine((data) => data.name || data.description || data.organizationId, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

/**
 * Validation schema for amenity query parameters
 */
export const amenityQueryParamsSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID").optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().max(255).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Validation schema for bulk amenity operations
 */
export const bulkAmenitySchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  amenities: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Name is required")
          .max(128, "Name must be less than 128 characters"),
        description: z.string().max(500).optional(),
      })
    )
    .min(1, "At least one amenity is required")
    .max(100, "Maximum 100 amenities per batch"),
});

/**
 * Validation schema for amenity name availability check
 */
export const amenityNameAvailabilitySchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  name: z.string().min(1, "Name is required"),
  excludeId: z.string().uuid("Invalid amenity ID").optional(), // For update operations
});

export type UpdateAmenityFormData = z.infer<typeof updateAmenitySchema>;

export type CreateAmenityFormData = z.infer<typeof createAmenitySchema>;
