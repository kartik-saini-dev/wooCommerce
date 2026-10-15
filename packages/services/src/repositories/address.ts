import { prisma } from "../db"

export class AddressRepository {
  static async getUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    })
  }

  static async getById(id: string, userId: string) {
    return prisma.address.findFirst({
      where: { id, userId }
    })
  }

  static async create(userId: string, data: { street: string; city: string; state: string; postalCode: string; country?: string; isDefault?: boolean }) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      })
    }

    return prisma.address.create({
      data: {
        ...data,
        userId
      }
    })
  }

  static async update(id: string, userId: string, data: { street: string; city: string; state: string; postalCode: string; country?: string; isDefault?: boolean }) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: id } },
        data: { isDefault: false }
      })
    }

    return prisma.address.update({
      where: { id, userId },
      data
    })
  }

  static async delete(id: string, userId: string) {
    return prisma.address.delete({
      where: { id, userId }
    })
  }
}
