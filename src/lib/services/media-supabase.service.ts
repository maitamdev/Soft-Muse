import type { Media } from '@/data/mock/media';
import { createClient } from '@/lib/supabase/client';

export interface MediaFilters { search?: string; folder?: string; type?: string; }
export interface MediaUploadOptions { folder?: string; alt?: string; tags?: string[]; }
type MediaRow = Record<string, unknown>;

function mapMedia(row: MediaRow): Media {
 const supabase = createClient();
 const path = String(row.storage_path);
 const url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
 return { id: String(row.id), fileName: String(row.file_name), originalName: String(row.original_name),
  alt: String(row.alt_text ?? ''), mimeType: String(row.mime_type), width: Number(row.width ?? 0),
  height: Number(row.height ?? 0), size: Number(row.file_size ?? 0), folder: String(row.folder ?? 'uncategorized'),
  url, thumbnail: url, uploadedAt: String(row.created_at), uploadedBy: String(row.uploaded_by ?? 'Admin'),
  usedIn: (row.used_in as string[] | null) ?? [], tags: (row.tags as string[] | null) ?? [] };
}

async function imageDimensions(file: File) {
 if (!file.type.startsWith('image/')) return { width: 0, height: 0 };
 try {
  const bitmap = await createImageBitmap(file);
  const result = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return result;
 } catch { return { width: 0, height: 0 }; }
}

export const SupabaseMediaService = {
 async getMedia(filters?: MediaFilters): Promise<Media[]> {
  let query = createClient().from('media_assets').select('*').order('created_at', { ascending: false });
  if (filters?.search) {
   const search = filters.search.replace(/[,%()]/g, ' ').trim();
   if (search) query = query.or(`original_name.ilike.%${search}%,alt_text.ilike.%${search}%`);
  }
  if (filters?.folder && filters.folder !== 'all') query = query.eq('folder', filters.folder);
  if (filters?.type && filters.type !== 'all') query = query.ilike('mime_type', `${filters.type}%`);
  const { data, error } = await query;
  if (error) throw new Error(`Không thể tải thư viện media: ${error.message}`);
  return (data ?? []).map(mapMedia);
 },

 async uploadMedia(file: File, options: MediaUploadOptions = {}): Promise<Media> {
  if (!file.type.startsWith('image/') && file.type !== 'application/pdf') throw new Error('Chỉ chấp nhận ảnh hoặc tệp PDF.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Tệp tải lên phải nhỏ hơn 10 MB.');
  const supabase = createClient();
  const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const folder = options.folder?.trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'uncategorized';
  const storagePath = `${folder}/${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from('media').upload(storagePath, file, { cacheControl: '31536000', upsert: false });
  if (uploadError) throw new Error(`Không thể tải tệp: ${uploadError.message}`);
  const dimensions = await imageDimensions(file);
  const { data, error } = await supabase.from('media_assets').insert({
   storage_path: storagePath, file_name: storagePath.split('/').pop(), original_name: file.name,
   alt_text: options.alt ?? '', mime_type: file.type, width: dimensions.width, height: dimensions.height,
   file_size: file.size, folder, tags: options.tags ?? [], uploaded_by: (await supabase.auth.getUser()).data.user?.id,
  }).select('*').single();
  if (error) {
   await supabase.storage.from('media').remove([storagePath]);
   throw new Error(`Không thể lưu thông tin media: ${error.message}`);
  }
  return mapMedia(data);
 },

 async updateMedia(id: string, data: Partial<Media>): Promise<Media> {
  const { data: updated, error } = await createClient().from('media_assets').update({
   original_name: data.originalName, alt_text: data.alt, folder: data.folder, tags: data.tags, used_in: data.usedIn,
  }).eq('id', id).select('*').single();
  if (error) throw new Error(`Không thể cập nhật media: ${error.message}`);
  return mapMedia(updated);
 },

 async deleteMedia(id: string): Promise<void> {
  const supabase = createClient();
  const { data, error: readError } = await supabase.from('media_assets').select('storage_path').eq('id', id).maybeSingle();
  if (readError) throw new Error(readError.message);
  if (!data) return;
  const { error } = await supabase.from('media_assets').delete().eq('id', id);
  if (error) throw new Error(`Không thể xóa media: ${error.message}`);
  const { error: storageError } = await supabase.storage.from('media').remove([data.storage_path]);
  if (storageError) throw new Error(`Đã xóa bản ghi nhưng không thể xóa tệp: ${storageError.message}`);
 },

 async deleteMultiple(ids: string[]): Promise<void> {
  for (const id of ids) await this.deleteMedia(id);
 },

 async getFolders(): Promise<string[]> {
  const { data, error } = await createClient().from('media_assets').select('folder').order('folder');
  if (error) throw new Error(error.message);
  return Array.from(new Set(((data ?? []) as Array<{ folder: string }>).map((row) => row.folder).filter(Boolean)));
 },
};
