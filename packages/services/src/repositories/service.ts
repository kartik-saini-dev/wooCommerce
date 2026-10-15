import { prisma as db } from "@repo/db"
import { Prisma } from "@prisma/client"
import { ServiceInput } from "@repo/services/validations/service"

export class ServiceRepository {
  static async findAll() {
    return db.service.findMany({
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async findById(id: string) {
    return db.service.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })
  }

  static async create(data: ServiceInput) {
    const { images, estimatedHrs, ...serviceData } = data

    return db.service.create({
      data: {
        ...serviceData,
        estimatedHrs: estimatedHrs === "" ? null : estimatedHrs,
        images: {
          create: images.map((url, index) => ({
            url,
            sortOrder: index,
            isPrimary: index === 0,
          }))
        }
      } as any
    })
  }

  static async update(id: string, data: ServiceInput) {
    const { images, estimatedHrs, ...serviceData } = data

    return db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete old images
      await tx.serviceImage.deleteMany({
        where: { serviceId: id }
      })

      // Update service and create new images
      return tx.service.update({
        where: { id },
        data: {
          ...serviceData,
          estimatedHrs: estimatedHrs === "" ? null : estimatedHrs,
          images: {
            create: images.map((url, index) => ({
              url,
              sortOrder: index,
              isPrimary: index === 0,
            }))
          }
        } as any
      })
    })
  }

  static async delete(id: string) {
    return db.service.delete({
      where: { id },
    })
  }
}
