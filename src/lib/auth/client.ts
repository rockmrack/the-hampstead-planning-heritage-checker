/**
 * Client-side Authentication Utilities
 * React hooks and components for authentication
 */

'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useCallback } from 'react';

import { UserRole } from './config';

/**
 * Hook to get current authentication state
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    status,
  };
}

/**
 * Hook to check if user has required role
 */
export function useHasRole(requiredRole: UserRole): boolean {
  const { user } = useAuth();
  if (!user) return false;

  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.USER]: 1,
    [UserRole.ADMIN]: 2,
    [UserRole.SUPER_ADMIN]: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

/**
 * Hook to get sign in/out functions
 */
export function useAuthActions() {
  const handleSignIn = useCallback(async (
    provider?: string,
    options?: { callbackUrl?: string; redirect?: boolean }
  ) => {
    return signIn(provider, {
      callbackUrl: options?.callbackUrl ?? '/',
      redirect: options?.redirect ?? true,
    });
  }, []);

  const handleSignOut = useCallback(async (
    options?: { callbackUrl?: string; redirect?: boolean }
  ) => {
    return signOut({
      callbackUrl: options?.callbackUrl ?? '/',
      redirect: options?.redirect ?? true,
    });
  }, []);

  const handleSignInWithCredentials = useCallback(async (
    email: string,
    password: string,
    options?: { callbackUrl?: string; redirect?: boolean }
  ) => {
    return signIn('credentials', {
      email,
      password,
      callbackUrl: options?.callbackUrl ?? '/',
      redirect: options?.redirect ?? false,
    });
  }, []);

  return {
    signIn: handleSignIn,
    signOut: handleSignOut,
    signInWithCredentials: handleSignInWithCredentials,
  };
}

export { UserRole };
