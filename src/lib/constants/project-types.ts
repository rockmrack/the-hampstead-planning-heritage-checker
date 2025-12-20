/**
 * Project Type Constants
 * Safe constants that can be imported without circular dependencies
 */

export const PROJECT_TYPE_IDS = {
  SIDE_EXTENSION: 'side-extension',
  LOFT_CONVERSION: 'loft-conversion',
  BASEMENT: 'basement',
  REAR_EXTENSION: 'rear-extension-single',
  REAR_EXTENSION_DOUBLE: 'rear-extension-double',
} as const;

export type ProjectTypeId = typeof PROJECT_TYPE_IDS[keyof typeof PROJECT_TYPE_IDS];