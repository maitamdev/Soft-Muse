import type { MediaItem, MediaItemCreateDTO, MediaFolder } from '@/types/cms';
import type { IMediaRepository } from '@/lib/contracts/v2/ICmsRepository';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
import { createBaseFields } from '@/lib/utils/base-entity';

export class MockMediaRepository implements IMediaRepository {
 private items: MediaItem[] = [];
 private folders: MediaFolder[] = [];

 async list(options: QueryOptions & { folderId?: string; type?: string; tag?: string } = {}): Promise<PaginatedResult<MediaItem>> {
 let result = this.items.filter(i => !i.deletedAt);
 if (options.folderId !== undefined) result = result.filter(i => i.folderId === options.folderId);
 if (options.type) result = result.filter(i => i.type === options.type);
 if (options.tag) result = result.filter(i => i.tags.includes(options.tag!));
 if (options.search) { const q = options.search.toLowerCase(); result = result.filter(i => i.name.toLowerCase().includes(q)); }
 return paginate(result, options);
 }
 async findById(id: string) { return this.items.find(i => i.id === id && !i.deletedAt) ?? null; }
 async create(data: MediaItemCreateDTO): Promise<MediaItem> {
 const item: MediaItem = { ...createBaseFields(), usedBy: [], ...data };
 this.items.unshift(item);
 return item;
 }
 async update(id: string, data: Partial<Pick<MediaItem, 'name' | 'altTextAr' | 'tags' | 'folderId'>>): Promise<MediaItem> {
 const idx = this.items.findIndex(i => i.id === id);
 if (idx === -1) throw new Error('Media item not found');
 this.items[idx] = { ...this.items[idx], ...data };
 return this.items[idx];
 }
 async delete(id: string) { const idx = this.items.findIndex(i => i.id === id); if (idx !== -1) this.items.splice(idx, 1); }
 async bulkDelete(ids: string[]) { this.items = this.items.filter(i => !ids.includes(i.id)); }
 async addTag(id: string, tag: string) { const i = this.items.find(m => m.id === id); if (i && !i.tags.includes(tag)) i.tags.push(tag); }
 async removeTag(id: string, tag: string) { const i = this.items.find(m => m.id === id); if (i) i.tags = i.tags.filter(t => t !== tag); }
 async moveToFolder(ids: string[], folderId: string | null) { this.items = this.items.map(i => ids.includes(i.id) ? { ...i, folderId } : i); }
 async search(query: string, options?: QueryOptions): Promise<PaginatedResult<MediaItem>> { return this.list({ ...options, search: query }); }
 async getFolders() { return [...this.folders]; }
 async createFolder(data: Omit<MediaFolder, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'status'>): Promise<MediaFolder> {
 const folder: MediaFolder = { ...createBaseFields(), ...data };
 this.folders.push(folder);
 return folder;
 }
 async updateFolder(id: string, nameAr: string): Promise<MediaFolder> {
 const f = this.folders.find(f => f.id === id);
 if (!f) throw new Error('Folder not found');
 f.nameAr = nameAr;
 return f;
 }
 async deleteFolder(id: string, moveContentsTo?: string | null) {
 await this.moveToFolder(this.items.filter(i => i.folderId === id).map(i => i.id), moveContentsTo ?? null);
 this.folders = this.folders.filter(f => f.id !== id);
 }
}
