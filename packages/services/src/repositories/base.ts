/**
 * Base Repository
 * Since Prisma doesn't support generic repository inheritance easily without heavy type hacking,
 * this file serves as a pattern demonstration and shared types for domain repositories.
 * 
 * Individual repositories (like user.ts, product.ts) will implement standard CRUD
 * operations using these types, ensuring consistent soft-delete handling.
 */

export interface BaseRepository<T, CreateInput, UpdateInput> {
  findById(id: string): Promise<T | null>
  findAll(options?: unknown): Promise<T[]>
  create(data: CreateInput): Promise<T>
  update(id: string, data: UpdateInput): Promise<T>
  delete(id: string, soft?: boolean): Promise<T>
}

// Example usage pattern:
// Each repository will explicitly define its Prisma delegate to maintain strict typing.
