import type { SiteSettings } from '@/types/settings';

/**
 * Settings repository — manages the single SiteSettings object.
 * In mock: reads/writes from an in-memory object.
 * In Supabase: reads/writes from a 'settings' table (one row per section).
 */
export interface ISettingsRepository {
 /** Load the complete settings object */
 get(): Promise<SiteSettings>;

 /** Get a specific section by key */
 getSection<K extends keyof SiteSettings>(section: K): Promise<SiteSettings[K]>;

 /** Update a specific section. Merges with existing values. */
 updateSection<K extends keyof SiteSettings>(
 section: K,
 data: Partial<SiteSettings[K]>
 ): Promise<SiteSettings[K]>;

 /** Replace the entire settings object (for import/restore) */
 replace(settings: SiteSettings): Promise<SiteSettings>;

 /** Get the current schema version */
 getVersion(): Promise<{ schemaVersion: number; settingsVersion: number }>;

 /** Bump the settings version on every save */
 bumpVersion(): Promise<void>;
}
