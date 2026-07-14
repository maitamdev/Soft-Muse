import { eventBus } from "@/lib/events/EventBus";
import { CollectionService, Collection } from "@/lib/services/collection.service";
import { loadStorefrontSetting, saveStorefrontSetting } from "./settings-storage";

/**
 * Storefront merchandising state for a collection — how it is presented on the
 * public site. This is intentionally separate from the catalog CRUD data
 * (CollectionService): the catalog owns the collection's name/products/rules,
 * while this layer owns presentation (visibility, featured, display order).
 */
export interface CollectionDisplay {
 collectionId: string;
 visible: boolean;
 featured: boolean;
 order: number;
}

export interface MerchandisedCollection extends Collection {
 display: CollectionDisplay;
}

// Mock-first persistence keyed by collection id. When Supabase lands, only the
// reads/writes below change (swap this map for a repository) — the public
// interface and the consuming UI stay identical.
const displayState: Record<string, CollectionDisplay> = {};
const hydrateDisplay = async () => {
 const shared = await loadStorefrontSetting<Record<string, CollectionDisplay>>("storefront.collections", displayState);
 Object.keys(displayState).forEach((key) => delete displayState[key]);
 Object.assign(displayState, shared);
};
const persistDisplay = async () => { await saveStorefrontSetting("storefront.collections", displayState); };

function ensureDefaults(collections: Collection[]) {
 let changed = false;
 const validIds = new Set(collections.map((collection) => collection.id));
 Object.keys(displayState).forEach((id) => {
 if (!validIds.has(id)) { delete displayState[id]; changed = true; }
 });
 collections.forEach((c, idx) => {
 if (!displayState[c.id]) {
 displayState[c.id] = {
 collectionId: c.id,
 visible: c.status === "active",
 featured: false,
 order: idx,
 };
 changed = true;
 }
 });
 return changed;
}

export const CollectionDisplayService = {
 async getMerchandised(): Promise<MerchandisedCollection[]> {
 await hydrateDisplay();
 const collections = await CollectionService.getCollections();
 if (ensureDefaults(collections)) await persistDisplay();
 return collections
 .map((c) => ({ ...c, display: displayState[c.id] }))
 .sort((a, b) => a.display.order - b.display.order);
 },

 async setVisibility(collectionId: string, visible: boolean): Promise<void> {
 await hydrateDisplay();
 if (displayState[collectionId]) {
 displayState[collectionId].visible = visible;
 await persistDisplay();
 eventBus.emit("storefront.collections.updated", { collectionId, visible });
 }
 },

 async setFeatured(collectionId: string, featured: boolean): Promise<void> {
 await hydrateDisplay();
 if (displayState[collectionId]) {
 displayState[collectionId].featured = featured;
 await persistDisplay();
 eventBus.emit("storefront.collections.updated", { collectionId, featured });
 }
 },

 async reorder(orderedIds: string[]): Promise<void> {
 await hydrateDisplay();
 orderedIds.forEach((id, idx) => {
 if (displayState[id]) displayState[id].order = idx;
 });
 await persistDisplay();
 eventBus.emit("storefront.collections.reordered", { orderedIds });
 },
};
