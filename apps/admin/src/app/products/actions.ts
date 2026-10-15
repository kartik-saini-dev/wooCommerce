"use server"

import { revalidatePath } from "next/cache"
import { ProductRepository } from "@repo/services/repositories/product"
import { productSchema, type ProductInput } from "@repo/services/validations/product"
import { getServerSession } from "next-auth/next"
import { adminAuthOptions } from "@/lib/auth"
import { LoggerService } from "@repo/services/services/logger.service"
import { Prisma } from "@prisma/client"

async function verifyAdmin() {
  const session = await getServerSession(adminAuthOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
}

function handleActionError(error: unknown, action: string) {
  LoggerService.error(`Failed to ${action}:`, error)
  if (error instanceof Error && error.message === "Unauthorized") {
    return { error: "Unauthorized access." }
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return { error: "A product with this slug already exists." }
    }
  }
  return { error: `Failed to ${action}. Please try again.` }
}

export async function createProductAction(data: ProductInput) {
  try {
    await verifyAdmin()
    const validatedData = productSchema.parse(data)
    await ProductRepository.create(validatedData as any)
    
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    return handleActionError(error, "create product")
  }
}

export async function updateProductAction(id: string, data: ProductInput) {
  try {
    await verifyAdmin()
    const validatedData = productSchema.parse(data)
    await ProductRepository.update(id, validatedData as any)
    
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    return handleActionError(error, "update product")
  }
}

export async function deleteProductAction(id: string) {
  try {
    await verifyAdmin()
    await ProductRepository.delete(id)
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    return handleActionError(error, "delete product")
  }
}

export async function bulkDeleteProductsAction(ids: string[]) {
  try {
    await verifyAdmin()
    await ProductRepository.bulkDelete(ids)
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    return handleActionError(error, "bulk delete products")
  }
}

export async function bulkUpdateProductStatusAction(ids: string[], isActive: boolean) {
  try {
    await verifyAdmin()
    await ProductRepository.bulkUpdateStatus(ids, isActive)
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    return handleActionError(error, "bulk update status")
  }
}

