import { prisma } from "../db"
import { buildQuery, notDeleted, QueryOptions } from "../db-helpers"
import { Prisma, User, Role } from "@prisma/client"

export class UserRepository {
  /**
   * Find a user by ID
   */
  static async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id,
        ...notDeleted
      },
      include: {
        addresses: true
      }
    })
  }

  /**
   * Find a user by Email
   */
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        ...notDeleted
      }
    })
  }

  /**
   * Find all users with pagination and optional filtering
   */
  static async findAll(
    options?: QueryOptions & { role?: Role; search?: string }
  ) {
    const query = buildQuery(options)
    
    const where: Prisma.UserWhereInput = {
      ...notDeleted,
    }

    if (options?.role) {
      where.role = options.role
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        ...query,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          // Exclude password for safety
        }
      }),
      prisma.user.count({ where })
    ])

    return { items, total }
  }

  /**
   * Soft delete a user
   */
  static async delete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
  }

  /**
   * Update Profile
   */
  static async updateProfile(id: string, name: string) {
    return prisma.user.update({
      where: { id },
      data: { name }
    })
  }

  /**
   * Change Password
   */
  static async updatePassword(id: string, newPasswordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { password: newPasswordHash }
    })
  }
}
