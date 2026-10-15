import { prisma } from "../db"
import { buildQuery, notDeleted, QueryOptions } from "../db-helpers"
import { Prisma, Product } from "@prisma/client"
import { deleteCloudinaryImage } from "../utils/cloudinary"

export class ProductRepository {
  /**
   * Find a product by its ID (only active, non-deleted by default)
   */
  static async findById(id: string, includeDeleted = false): Promise<Product | null> {
    return prisma.product.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : notDeleted)
      },
      include: {
        brand: true,
        category: true,
        images: true,
        specifications: true,
        variants: true,
        inventory: true
      }
    })
  }

  /**
   * Find a product by its slug
   */
  static async findBySlug(slug: string): Promise<Product | null> {
    return prisma.product.findFirst({
      where: {
        slug,
        ...notDeleted
      },
      include: {
        brand: true,
        category: true,
        images: true,
        specifications: true,
        variants: true,
        inventory: true
      }
    })
  }

  /**
   * Find all products with pagination and optional filtering
   */
  static async findAll(
    options?: QueryOptions & { categoryId?: string; brandId?: string; search?: string }
  ) {
    const query = buildQuery(options)
    
    const where: Prisma.ProductWhereInput = {
      ...notDeleted,
      isActive: true,
    }

    if (options?.categoryId) {
      where.categoryId = options.categoryId
    }
    
    if (options?.brandId) {
      where.brandId = options.brandId
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
        { sku: { contains: options.search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        ...query,
        include: {
          images: {
            where: { isPrimary: true }, // Fast loading, only primary image
            take: 1
          },
          inventory: {
            select: { quantity: true }
          },
          category: {
            select: { name: true, slug: true }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    return { items, total }
  }

  /**
   * Soft delete a product
   */
  static async delete(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true }
    })
    
    if (product && product.images.length > 0) {
      for (const img of product.images) {
        await deleteCloudinaryImage(img.url)
      }
      await prisma.productImage.deleteMany({
        where: { productId: id }
      })
    }

    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false }
    })
  }

  /**
   * Create a new product with its primary image and inventory
   */
  static async create(data: Omit<Prisma.ProductUncheckedCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & { images: string[], inventoryQuantity: number, lowStockThreshold: number }) {
    const { images, inventoryQuantity, lowStockThreshold, ...productData } = data

    return prisma.product.create({
      data: {
        ...productData,
        inventory: {
          create: {
            quantity: inventoryQuantity,
            lowStock: lowStockThreshold
          }
        },
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            isPrimary: index === 0,
            sortOrder: index
          }))
        }
      }
    })
  }

  /**
   * Update an existing product
   */
  static async update(id: string, data: Partial<Omit<Prisma.ProductUncheckedCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>> & { images?: string[], inventoryQuantity?: number, lowStockThreshold?: number }) {
    const { images, inventoryQuantity, lowStockThreshold, ...productData } = data

    // First, update the core product fields
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        inventory: {
          update: {
            quantity: inventoryQuantity,
            lowStock: lowStockThreshold
          }
        }
      }
    })

    // If images are provided, we replace the existing ones completely for simplicity,
    // or we could do a smart sync. Given the UI, deleting and recreating is robust.
    if (images && images.length > 0) {
      const oldImages = await prisma.productImage.findMany({ where: { productId: id } })
      const imagesToDelete = oldImages.filter((oldImg: any) => !images.includes(oldImg.url))
      
      for (const img of imagesToDelete) {
        await deleteCloudinaryImage(img.url)
      }

      await prisma.productImage.deleteMany({ where: { productId: id } })
      await prisma.productImage.createMany({
        data: images.map((url: string, index: number) => ({
          productId: id,
          url,
          isPrimary: index === 0,
          sortOrder: index
        }))
      })
    }

    return updatedProduct
  }

  /**
   * Bulk Delete Products (Soft Delete)
   */
  static async bulkDelete(ids: string[]) {
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: { images: true }
    })
    
    for (const product of products) {
      if (product.images.length > 0) {
        for (const img of product.images) {
          await deleteCloudinaryImage(img.url)
        }
      }
    }
    
    await prisma.productImage.deleteMany({
      where: { productId: { in: ids } }
    })

    return prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date(), isActive: false }
    })
  }

  /**
   * Bulk Update Status
   */
  static async bulkUpdateStatus(ids: string[], isActive: boolean) {
    return prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive }
    })
  }
}
