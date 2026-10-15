import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(100),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  parentId: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
})

export type CategoryInput = z.infer<typeof categorySchema>
