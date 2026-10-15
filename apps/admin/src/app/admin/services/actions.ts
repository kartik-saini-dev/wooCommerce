"use server"

import { revalidatePath } from "next/cache"
import { ServiceRepository } from "@repo/services/repositories/service"
import { serviceSchema, ServiceInput } from "@repo/services/validations/service"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { adminAuthOptions } from "@/lib/auth"
import { LoggerService } from "@repo/services/services/logger.service"

async function verifyAdmin() {
  const session = await getServerSession(adminAuthOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
}

function handleActionError(error: unknown, action: string) {
  LoggerService.error(`Failed to ${action}:`, error)
  if (error instanceof Error && error.message === "Unauthorized") {
    return { success: false, error: "Unauthorized access." }
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return { success: false, error: "A service with this slug already exists." }
    }
  }
  return { success: false, error: `Failed to ${action}. Please try again.` }
}

export async function createService(data: ServiceInput) {
  try {
    await verifyAdmin()
    const validatedData = serviceSchema.parse(data)
    const service = await ServiceRepository.create(validatedData)
    
    revalidatePath("/admin/services")
    
    return { success: true, data: service }
  } catch (error) {
    return handleActionError(error, "create service")
  }
}

export async function updateService(id: string, data: ServiceInput) {
  try {
    await verifyAdmin()
    const validatedData = serviceSchema.parse(data)
    const service = await ServiceRepository.update(id, validatedData)
    
    revalidatePath("/admin/services")
    revalidatePath(`/admin/services/${id}/edit`)
    
    return { success: true, data: service }
  } catch (error) {
    return handleActionError(error, "update service")
  }
}

export async function deleteService(id: string) {
  try {
    await verifyAdmin()
    await ServiceRepository.delete(id)
    revalidatePath("/admin/services")
    return { success: true }
  } catch (error) {
    return handleActionError(error, "delete service")
  }
}

