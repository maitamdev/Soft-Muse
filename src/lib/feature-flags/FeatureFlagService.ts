import type { FeatureFlags } from '@/types/feature-flags';
import { DEFAULT_FEATURE_FLAGS } from '@/types/feature-flags';

/**
 * FeatureFlagService — resolves feature flags at runtime.
 *
 * Mock: reads from DEFAULT_FEATURE_FLAGS (merged with any overrides).
 * Production: reads from SiteSettings.featureFlags (loaded from Supabase).
 *
 * Flags can be overridden at startup by calling FeatureFlagService.init(flags).
 */
class FeatureFlagService {
  private flags: FeatureFlags = { ...DEFAULT_FEATURE_FLAGS };
  private initialized = false;

  /** Initialize with values from settings (call once at app startup) */
  init(flags: Partial<FeatureFlags>): void {
    this.flags = { ...DEFAULT_FEATURE_FLAGS, ...flags };
    this.initialized = true;
  }

  /** Check if a feature is enabled */
  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag] === true;
  }

  /** Get all flags */
  getAll(): FeatureFlags {
    return { ...this.flags };
  }

  /** Override a specific flag (for testing / admin toggle) */
  override(flag: keyof FeatureFlags, value: boolean): void {
    this.flags = { ...this.flags, [flag]: value };
  }

  /** Reset to defaults */
  reset(): void {
    this.flags = { ...DEFAULT_FEATURE_FLAGS };
  }
}

export const featureFlagService = new FeatureFlagService();
