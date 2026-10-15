/**
 * DB Helpers
 * Provides shared utilities for pagination, sorting, and query sanitization.
 */

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SortParams {
  sortBy?: string
  sortDir?: "asc" | "desc"
}

export interface QueryOptions extends PaginationParams, SortParams {}

export function getPaginationQuery({ page = 1, limit = 10 }: PaginationParams) {
  const skip = (page - 1) * limit
  return {
    skip,
    take: limit,
  }
}

export function getSortQuery({ sortBy, sortDir = "desc" }: SortParams, defaultSort: string = "createdAt") {
  return {
    orderBy: {
      [sortBy || defaultSort]: sortDir,
    },
  }
}

/**
 * Helper to build standard queries including pagination and sorting
 */
export function buildQuery(options?: QueryOptions, defaultSort?: string) {
  const pagination = getPaginationQuery(options || {})
  const sort = getSortQuery(options || {}, defaultSort)

  return {
    ...pagination,
    ...sort,
  }
}

/**
 * Standard soft-delete filter
 */
export const notDeleted = {
  deletedAt: null,
}
