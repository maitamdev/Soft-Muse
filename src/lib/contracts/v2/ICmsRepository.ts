import type { Article, ArticleCreateDTO, ArticleUpdateDTO, CmsPage, CmsPageCreateDTO, CmsPageUpdateDTO, MediaItem, MediaItemCreateDTO, MediaFolder } from '@/types/cms';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import type { IBaseRepository } from './IBaseRepository';

export interface IArticleRepository
 extends IBaseRepository<Article, ArticleCreateDTO, ArticleUpdateDTO> {
 getBySlug(slug: string): Promise<Article | null>;
 getPublished(options?: QueryOptions): Promise<PaginatedResult<Article>>;
 getFeatured(limit?: number): Promise<Article[]>;
 getByTag(tag: string, options?: QueryOptions): Promise<PaginatedResult<Article>>;
 publish(id: string): Promise<Article>;
 unpublish(id: string): Promise<Article>;
 incrementViews(id: string): Promise<void>;
}

export interface ICmsPageRepository
 extends IBaseRepository<CmsPage, CmsPageCreateDTO, CmsPageUpdateDTO> {
 getBySlug(slug: string): Promise<CmsPage | null>;
 getSystemPages(): Promise<CmsPage[]>;
 getCustomPages(options?: QueryOptions): Promise<PaginatedResult<CmsPage>>;
 reorder(orderedIds: string[]): Promise<void>;
}

export interface IMediaRepository {
 list(options?: QueryOptions & { folderId?: string; type?: string; tag?: string }): Promise<PaginatedResult<MediaItem>>;
 findById(id: string): Promise<MediaItem | null>;
 create(data: MediaItemCreateDTO): Promise<MediaItem>;
 update(id: string, data: Partial<Pick<MediaItem, 'name' | 'altTextAr' | 'tags' | 'folderId'>>): Promise<MediaItem>;
 delete(id: string): Promise<void>;
 bulkDelete(ids: string[]): Promise<void>;
 addTag(id: string, tag: string): Promise<void>;
 removeTag(id: string, tag: string): Promise<void>;
 moveToFolder(ids: string[], folderId: string | null): Promise<void>;
 search(query: string, options?: QueryOptions): Promise<PaginatedResult<MediaItem>>;

 // Folders
 getFolders(): Promise<MediaFolder[]>;
 createFolder(data: Omit<MediaFolder, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'status'>): Promise<MediaFolder>;
 updateFolder(id: string, nameAr: string): Promise<MediaFolder>;
 deleteFolder(id: string, moveContentsTo?: string | null): Promise<void>;
}
