/**
 * Feature Flags Configuration
 * Centralized feature toggle management for GrowUp Yourself MVP
 *
 * Principles:
 * - Offline-first by design (all flags default to offline-capable features)
 * - Privacy-preserving (no telemetry/tracking unless explicitly enabled)
 * - Accessibility always enabled
 */

interface FeatureFlags {
  // AI & Machine Learning
  AI_ENABLED: boolean;
  AI_LOCAL_ONLY: boolean;

  // Security & Privacy
  BACKUP_ENCRYPTION: boolean;
  ANALYTICS_ENABLED: boolean;

  // UI/UX Features
  DARK_MODE_ENABLED: boolean;
  ACCESSIBILITY_ENHANCED: boolean;

  // Data & Sync
  CLOUD_SYNC: boolean;
  OFFLINE_MODE: boolean;

  // Debug & Development
  DEBUG_LOGS: boolean;
  MOCK_DATA: boolean;
}

export const featureFlags: FeatureFlags = {
  // AI Features
  // Set to true to enable on-device AI for health chat
  // Falls back to calculators if LLM load fails
  AI_ENABLED: true,

  // Force local-only AI (no cloud API calls)
  AI_LOCAL_ONLY: true,

  // Security
  // Optional encryption for backup files
  BACKUP_ENCRYPTION: false,

  // Analytics (disable for privacy)
  ANALYTICS_ENABLED: false,

  // UI
  DARK_MODE_ENABLED: true,

  // Accessibility (always on)
  ACCESSIBILITY_ENHANCED: true,

  // Data Layer
  // Cloud sync disabled for MVP (offline-first design)
  CLOUD_SYNC: false,

  // Offline mode (primary mode)
  OFFLINE_MODE: true,

  // Debug
  DEBUG_LOGS: process.env.NODE_ENV === 'development',
  MOCK_DATA: false,
};

/**
 * Get feature flag value
 * @param flag - Feature flag key
 * @returns true if feature is enabled
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return featureFlags[flag];
}

/**
 * Check multiple features at once
 * @param flags - Array of feature flag keys
 * @returns true if all features are enabled
 */
export function areAllFeaturesEnabled(...flags: (keyof FeatureFlags)[]): boolean {
  return flags.every((flag) => isFeatureEnabled(flag));
}

/**
 * Check if any feature is enabled
 * @param flags - Array of feature flag keys
 * @returns true if any feature is enabled
 */
export function isAnyFeatureEnabled(...flags: (keyof FeatureFlags)[]): boolean {
  return flags.some((flag) => isFeatureEnabled(flag));
}

export default featureFlags;
