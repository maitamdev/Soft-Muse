/**
 * Standard query options — all repository list methods accept this.
 * Supabase implementation will translate these to query builders.
 */
export interface QueryOptions {
  page?: number;                          // 1-based. Default: 1
  pageSize?: number;                      // Default: 20
  search?: string;                        // Full-text search term
  sortBy?: string;                        // Field name to sort by
  sortDirection?: 'asc' | 'desc';         // Default: 'desc'
  filters?: Record<string, unknown>;      // Entity-specific filters
  includeArchived?: boolean;              // Default: false
  includeDeleted?: boolean;              // Default: false
}

/**
 * Standard paginated response — all repository list methods return this.
 * Never return raw arrays from list endpoints.
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;        // Total matching records (for pagination UI)
  page: number;
  pageSize: number;
  totalPages: number;   // Math.ceil(total / pageSize)
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Helper to build a PaginatedResult from an array (used by mock repositories).
 * Supabase repositories will compute these from query metadata.
 */
export function paginate<T>(
  allItems: T[],
  options: QueryOptions = {}
): PaginatedResult<T> {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const total = allItems.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = allItems.slice(start, start + pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
