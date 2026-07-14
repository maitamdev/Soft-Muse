'use client';

import { useCallback } from 'react';
import type { FeatureFlags } from '@/types/feature-flags';
import { featureFlagService } from '@/lib/feature-flags/FeatureFlagService';

/**
 * Hook to check feature flags in React components.
 *
 * Usage:
 * const { isEnabled } = useFeatureFlag();
 * if (!isEnabled('enableReturns')) return null;
 *
 * When Supabase is integrated, this hook will re-render when flags
 * change in real-time (via Supabase Realtime subscription).
 */
export function useFeatureFlag() {
 const isEnabled = useCallback(
 (flag: keyof FeatureFlags): boolean => featureFlagService.isEnabled(flag),
 []
 );

 const getAll = useCallback(
 (): FeatureFlags => featureFlagService.getAll(),
 []
 );

 return { isEnabled, getAll };
}

/**
 * Guard component — renders children only if a feature flag is enabled.
 *
 * Usage:
 * <FeatureGate flag="enableReturns" fallback={<p>không</p>}>
 * <ReturnsPage />
 * </FeatureGate>
 */
export function FeatureGate({
 flag,
 children,
 fallback = null,
}: {
 flag: keyof FeatureFlags;
 children: React.ReactNode;
 fallback?: React.ReactNode;
}): React.ReactNode {
 const { isEnabled } = useFeatureFlag();
 return isEnabled(flag) ? children : fallback;
}
