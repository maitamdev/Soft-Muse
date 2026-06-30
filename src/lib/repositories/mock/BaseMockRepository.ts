import type { BaseEntity } from '@/types/base';
import type { QueryOptions, PaginatedResult } from '@/types/query';
import type { IBaseRepository } from '@/lib/contracts/v2/IBaseRepository';
import { createBaseFields, updateBaseFields, softDeleteFields, archiveFields, restoreFields, applyBaseFilters } from '@/lib/utils/base-entity';
import { paginate } from '@/types/query';
import { generateId } from '@/lib/utils/uuid';

/**
 * BaseMockRepository — provides default CRUD implementations.
 *
 * Every mock repository extends this. Entity-specific methods are
 * implemented in each subclass.
 *
 * In-memory storage: each repository instance holds its own array.
 * This is intentional — Supabase repositories will use actual DB connections.
 *
 * Seeding: pass initial data to the constructor.
 */
export abstract class BaseMockRepository<
  TEntity extends BaseEntity,
  TCreate,
  TUpdate,
  TFilters = Record<string, unknown>,
> implements IBaseRepository<TEntity, TCreate, TUpdate, TFilters> {

  protected items: TEntity[];

  constructor(initialData: TEntity[] = []) {
    this.items = [...initialData];
  }

  /** Subclasses override to apply entity-specific search and filters */
  protected applyFilters(items: TEntity[], options: QueryOptions & { filters?: TFilters }): TEntity[] {
    return items; // Default: no additional filtering
  }

  /** Subclasses override to apply sort logic */
  protected applySort(items: TEntity[], sortBy?: string, sortDirection?: 'asc' | 'desc'): TEntity[] {
    if (!sortBy) return items;
    const dir = sortDirection ?? 'desc';
    return [...items].sort((a, b) => {
      const av = (a as any)[sortBy];
      const bv = (b as any)[sortBy];
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /** Subclasses override to apply text search */
  protected applySearch(items: TEntity[], search: string): TEntity[] {
    return items; // Default: no text search
  }

  /** Subclasses must implement: merge TCreate with base fields to build TEntity */
  protected abstract buildEntity(data: TCreate, base: BaseEntity): TEntity;

  /** Subclasses must implement: merge TUpdate into existing entity */
  protected abstract mergeUpdate(existing: TEntity, data: TUpdate): TEntity;

  async list(options: QueryOptions & { filters?: TFilters } = {}): Promise<PaginatedResult<TEntity>> {
    let result = applyBaseFilters(this.items, {
      includeArchived: options.includeArchived,
      includeDeleted: options.includeDeleted,
    });

    if (options.search) {
      result = this.applySearch(result, options.search);
    }

    result = this.applyFilters(result, options);
    result = this.applySort(result, options.sortBy, options.sortDirection);

    return paginate(result, options);
  }

  async findById(id: string): Promise<TEntity | null> {
    const item = this.items.find(i => i.id === id && i.deletedAt === null);
    return item ?? null;
  }

  async create(data: TCreate): Promise<TEntity> {
    const base = createBaseFields();
    const entity = this.buildEntity(data, base);
    this.items.unshift(entity);
    return entity;
  }

  async update(id: string, data: TUpdate): Promise<TEntity> {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Entity ${id} not found`);

    const updated = {
      ...this.mergeUpdate(this.items[index], data),
      ...updateBaseFields(),
    };

    this.items[index] = updated;
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Entity ${id} not found`);
    this.items[index] = { ...this.items[index], ...softDeleteFields() };
  }

  async archive(id: string): Promise<void> {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Entity ${id} not found`);
    this.items[index] = { ...this.items[index], ...archiveFields() };
  }

  async restore(id: string): Promise<void> {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Entity ${id} not found`);
    this.items[index] = { ...this.items[index], ...restoreFields() };
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.softDelete(id)));
  }

  async count(filters?: TFilters): Promise<number> {
    const result = await this.list({ filters: filters as any });
    return result.total;
  }

  /** Utility: duplicate an entity (generates new ID, resets audit fields) */
  protected async duplicateEntity(id: string, transform?: (entity: TEntity) => Partial<TEntity>): Promise<TEntity> {
    const original = await this.findById(id);
    if (!original) throw new Error(`Entity ${id} not found`);

    const base = createBaseFields();
    const duplicate: TEntity = {
      ...original,
      ...base,
      ...(transform ? transform(original) : {}),
    };

    this.items.unshift(duplicate);
    return duplicate;
  }
}
