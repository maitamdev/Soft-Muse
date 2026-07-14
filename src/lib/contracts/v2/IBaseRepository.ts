import type { BaseEntity } from '@/types/base';
import type { QueryOptions, PaginatedResult } from '@/types/query';

/**
 * Base repository interface — every domain repository extends this.
 *
 * TEntity = the full entity type (extends BaseEntity)
 * TCreate = DTO for creation (no id, no audit fields)
 * TUpdate = DTO for updates (all optional)
 * TFilters = domain-specific filter shape
 *
 * Supabase implementation and Mock implementation both implement
 * this same interface. Swapping data sources requires no page changes.
 */
export interface IBaseRepository<
 TEntity extends BaseEntity,
 TCreate,
 TUpdate,
 TFilters = Record<string, unknown>,
> {
 /** List with pagination, search, sorting, filtering */
 list(options?: QueryOptions & { filters?: TFilters }): Promise<PaginatedResult<TEntity>>;

 /** Get single by ID. Returns null if not found or soft-deleted. */
 findById(id: string): Promise<TEntity | null>;

 /** Create a new entity. Returns the created entity with generated fields. */
 create(data: TCreate): Promise<TEntity>;

 /** Update an existing entity. Returns the updated entity. */
 update(id: string, data: TUpdate): Promise<TEntity>;

 /** Soft-delete. Sets deletedAt and status = 'deleted'. */
 softDelete(id: string): Promise<void>;

 /** Archive. Sets isArchived = true and status = 'archived'. */
 archive(id: string): Promise<void>;

 /** Restore from archive. Sets isArchived = false and status = 'active'. */
 restore(id: string): Promise<void>;

 /** Bulk soft-delete. */
 bulkDelete(ids: string[]): Promise<void>;

 /** Count matching records. */
 count(filters?: TFilters): Promise<number>;
}
