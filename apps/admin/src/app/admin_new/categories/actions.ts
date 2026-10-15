"use server"

import { revalidatePath } from "next/cache"
import { CategoryRepository } from "@repo/services/repositories/category"
import { categorySchema, CategoryInput } from "@repo/services/validations/category"
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
      return { success: false, error: "A category with this slug already exists." }
    }
    if (error.code === "P2003") {
      return { success: false, error: "Cannot delete category because it has products assigned to it." }
    }
  }
  return { success: false, error: `Failed to ${action}. Please try again.` }
}

export async function createCategory(data: CategoryInput) {
  try {
    await verifyAdmin()
    const validatedData = categorySchema.parse(data)
    const category = await CategoryRepository.create(validatedData)
    
    revalidatePath("/admin/categories")
    
    return { success: true, data: category }
  } catch (error) {
    return handleActionError(error, "create category")
  }
}

export async function updateCategory(id: string, data: CategoryInput) {
  try {
    await verifyAdmin()
    const validatedData = categorySchema.parse(data)
    const category = await CategoryRepository.update(id, validatedData)
    
    revalidatePath("/admin/categories")
    revalidatePath(`/admin/categories/${id}/edit`)
    
    return { success: true, data: category }
  } catch (error) {
    return handleActionError(error, "update category")
  }
}

export async function deleteCategory(id: string) {
  try {
    await verifyAdmin()
    await CategoryRepository.delete(id)
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    return handleActionError(error, "delete category")
  }
}

