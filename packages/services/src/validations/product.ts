import * as z from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  sku: z.string().min(1, "SKU is required"),
  shortDescription: z.string().max(255).optional(),
  description: z.string().min(1, "Description is required"),
  
  price: z.coerce.number().min(0, "Price must be positive"),
  comparePrice: z.coerce.number().min(0, "Compare price must be positive").optional(),
  discount: z.coerce.number().min(0).max(100).optional(), // Assuming percentage
  
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional().transform(val => val === "" ? undefined : val),
  
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  
  // Images (URLs from Cloudinary)
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  
  // Inventory
  inventoryQuantity: z.coerce.number().min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce.number().min(0),
})

export type ProductInput = z.infer<typeof productSchema>
