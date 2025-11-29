/**
 * Authentication Module Index
 * Central export for authentication functionality
 */

// Server-side exports
export { authOptions, UserRole } from './config';
export type { AuthUser } from './config';

// Server utilities (use in API routes and server components)
export {
  getSession,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  requireAuth,
  requireRole,
  withAuth,
  withRole,
} from './server';

// Client utilities (use in client components)
export { useAuth, useHasRole, useAuthActions } from './client';
