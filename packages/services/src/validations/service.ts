import { z } from "zod"

export const serviceCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(100),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
})

export type ServiceCategoryInput = z.infer<typeof serviceCategorySchema>

export const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(100),
  categoryId: z.string().min(1, "Category is required"),
  shortDescription: z.string().max(255).optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.number().min(0, "Price must be a positive number"),
  estimatedHrs: z.number().min(0).optional().or(z.literal("")),
  availableAreas: z.array(z.string()),
  isEmergency: z.boolean(),
  isHomeVisit: z.boolean(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  seoTitle: z.string().max(100).optional().or(z.literal("")),
  seoDescription: z.string().max(255).optional().or(z.literal("")),
  images: z.array(z.string().url("Must be a valid URL")),
})

export type ServiceInput = z.infer<typeof serviceSchema>
