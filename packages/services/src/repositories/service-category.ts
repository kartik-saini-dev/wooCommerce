import { prisma as db } from "@repo/db"
import { ServiceCategoryInput } from "@repo/services/validations/service"

export class ServiceCategoryRepository {
  static async findAll() {
    return db.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    })
  }

  static async findById(id: string) {
    return db.serviceCategory.findUnique({
      where: { id },
    })
  }

  static async findBySlug(slug: string) {
    return db.serviceCategory.findUnique({
      where: { slug },
    })
  }

  static async create(data: ServiceCategoryInput) {
    return db.serviceCategory.create({
      data: data as any,
    })
  }

  static async update(id: string, data: ServiceCategoryInput) {
    return db.serviceCategory.update({
      where: { id },
      data: data as any,
    })
  }

  static async delete(id: string) {
    return db.serviceCategory.delete({
      where: { id },
    })
  }
}
