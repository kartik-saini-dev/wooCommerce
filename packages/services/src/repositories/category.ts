import { prisma as db } from "@repo/db"
import { CategoryInput } from "@repo/services/validations/category"

export class CategoryRepository {
  static async findAll() {
    return db.category.findMany({
      include: {
        parent: true,
      },
      orderBy: { sortOrder: 'asc' },
    })
  }

  static async findById(id: string) {
    return db.category.findUnique({
      where: { id },
    })
  }

  static async findBySlug(slug: string) {
    return db.category.findUnique({
      where: { slug },
    })
  }

  static async create(data: CategoryInput) {
    const { parentId, ...rest } = data
    return db.category.create({
      data: {
        ...rest,
        parentId: parentId || null
      } as any,
    })
  }

  static async update(id: string, data: CategoryInput) {
    const { parentId, ...rest } = data
    return db.category.update({
      where: { id },
      data: {
        ...rest,
        parentId: parentId || null
      } as any,
    })
  }

  static async delete(id: string) {
    return db.category.delete({
      where: { id },
    })
  }
}
