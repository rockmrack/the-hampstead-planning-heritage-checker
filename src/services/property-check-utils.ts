/**
 * Property Check Utilities
 * 
 * Client-safe utility functions for property checks.
 * Separated from the main service to avoid importing server-side dependencies (Redis, Supabase)
 * into client components.
 */

import { STATUS_CONFIG, EXPERT_OPINIONS } from '@/lib/config';
import type { PropertyCheckResult, PropertyStatus } from '@/types';

/**
 * Get expert opinion text based on property status.
 * Returns tailored guidance based on the heritage classification.
 * 
 * @param result - The property check result containing status and building details
 * @returns Expert opinion string with planning guidance
 */
export function getExpertOpinion(result: PropertyCheckResult): string {
  if (result.status === 'RED' && result.listedBuilding) {
    const grade = result.listedBuilding.grade;
    return EXPERT_OPINIONS.listed[grade] ?? EXPERT_OPINIONS.listed['II'];
  }

  if (result.status === 'AMBER') {
    if (result.hasArticle4) {
      return EXPERT_OPINIONS.conservation.article4;
    }
    return EXPERT_OPINIONS.conservation.default;
  }

  return EXPERT_OPINIONS.standard;
}

/**
 * Get status configuration for display
 */
export function getStatusConfig(status: PropertyStatus) {
  return STATUS_CONFIG[status];
}
