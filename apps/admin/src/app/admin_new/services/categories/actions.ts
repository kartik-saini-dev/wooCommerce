"use server"

import { revalidatePath } from "next/cache"
import { ServiceCategoryRepository } from "@repo/services/repositories/service-category"
import { serviceCategorySchema, ServiceCategoryInput } from "@repo/services/validations/service"
import { Prisma } from "@prisma/client"
import { prisma as db } from "@repo/db"
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
      return { success: false, error: "A category with this slug already exists." }
    }
    if (error.code === "P2003") {
      return { success: false, error: "Cannot delete category because it has services assigned to it." }
    }
  }
  return { success: false, error: `Failed to ${action}. Please try again.` }
}

export async function createServiceCategory(data: ServiceCategoryInput) {
  try {
    await verifyAdmin()
    const validatedData = serviceCategorySchema.parse(data)
    const category = await ServiceCategoryRepository.create(validatedData)
    
    revalidatePath("/admin/services/categories")
    
    return { success: true, data: category }
  } catch (error) {
    return handleActionError(error, "create service category")
  }
}

export async function updateServiceCategory(id: string, data: ServiceCategoryInput) {
  try {
    await verifyAdmin()
    const validatedData = serviceCategorySchema.parse(data)
    const category = await ServiceCategoryRepository.update(id, validatedData)
    
    revalidatePath("/admin/services/categories")
    revalidatePath(`/admin/services/categories/${id}/edit`)
    
    return { success: true, data: category }
  } catch (error) {
    return handleActionError(error, "update service category")
  }
}

export async function deleteServiceCategory(id: string) {
  try {
    await verifyAdmin()
    await ServiceCategoryRepository.delete(id)
    revalidatePath("/admin/services/categories")
    return { success: true }
  } catch (error) {
    return handleActionError(error, "delete service category")
  }
}

export async function bulkUpdateServiceCategoryOrder(categories: { id: string; sortOrder: number }[]) {
  try {
    await verifyAdmin()
    for (const cat of categories) {
      await db.serviceCategory.update({
        where: { id: cat.id },
        data: { sortOrder: cat.sortOrder }
      })
    }
    revalidatePath("/admin/services/categories")
    return { success: true }
  } catch (error) {
    return handleActionError(error, "reorder service categories")
  }
}

