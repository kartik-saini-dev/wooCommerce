import { z } from "zod"

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  scheduledDate: z.string().min(1, "Date is required"),
  serviceAddressId: z.string().min(1, "Address is required"),
  notes: z.string().optional()
})
