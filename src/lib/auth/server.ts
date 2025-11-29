/**
 * Server-side Authentication Utilities
 * Helper functions for checking auth in API routes and server components
 */

import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions, UserRole } from './config';
import { logger } from '@/lib/utils/logger';

/**
 * Get the current session on the server
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * Get the current user from session
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Check if user has required role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.USER]: 1,
    [UserRole.ADMIN]: 2,
    [UserRole.SUPER_ADMIN]: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

/**
 * Require authentication middleware for API routes
 */
export async function requireAuth(
  request: NextRequest,
  handler: (
    request: NextRequest,
    user: { id: string; email: string; role: UserRole }
  ) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getSession();

  if (!session?.user) {
    logger.warn('Unauthorized access attempt', {
      path: request.nextUrl.pathname,
    });

    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  return handler(request, {
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role,
  });
}

/**
 * Require specific role middleware for API routes
 */
export async function requireRole(
  request: NextRequest,
  requiredRole: UserRole,
  handler: (
    request: NextRequest,
    user: { id: string; email: string; role: UserRole }
  ) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  const hasRequiredRole = await hasRole(requiredRole);
  if (!hasRequiredRole) {
    logger.warn('Forbidden access attempt', {
      userId: session.user.id,
      requiredRole,
      userRole: session.user.role,
      path: request.nextUrl.pathname,
    });

    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return handler(request, {
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role,
  });
}

/**
 * Higher-order function to protect API routes
 */
export function withAuth<T extends NextRequest>(
  handler: (request: T, user: { id: string; email: string; role: UserRole }) => Promise<NextResponse>
) {
  return async (request: T): Promise<NextResponse> => {
    return requireAuth(request, handler as (request: NextRequest, user: { id: string; email: string; role: UserRole }) => Promise<NextResponse>);
  };
}

/**
 * Higher-order function to protect API routes with role check
 */
export function withRole<T extends NextRequest>(
  requiredRole: UserRole,
  handler: (request: T, user: { id: string; email: string; role: UserRole }) => Promise<NextResponse>
) {
  return async (request: T): Promise<NextResponse> => {
    return requireRole(request, requiredRole, handler as (request: NextRequest, user: { id: string; email: string; role: UserRole }) => Promise<NextResponse>);
  };
}

export default {
  getSession,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  requireAuth,
  requireRole,
  withAuth,
  withRole,
};
