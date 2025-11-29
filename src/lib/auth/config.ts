/**
 * NextAuth.js Configuration
 * Authentication configuration with multiple providers
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { z } from 'zod';

import { getSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/utils/logger';

// Validation schemas
const credentialsSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * User roles for authorization
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

/**
 * Extended user type with role
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt?: string;
}

/**
 * NextAuth configuration
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // Email/Password authentication
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const result = credentialsSchema.safeParse(credentials);
          if (!result.success) {
            logger.warn('Invalid credentials format', { 
              errors: result.error.errors 
            });
            return null;
          }

          const { email, password } = result.data;

          // Authenticate with Supabase
          const supabase = getSupabaseAdmin();
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error || !data.user) {
            logger.warn('Authentication failed', { 
              email, 
              error: error?.message 
            });
            return null;
          }

          // Get user profile with role
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          const user: AuthUser = {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.['name'] as string | undefined,
            role: (profile?.role as UserRole) ?? UserRole.USER,
          };

          logger.info('User authenticated', { 
            userId: user.id, 
            email: user.email 
          });

          return user;
        } catch (error) {
          logger.error('Authentication error', {
            error: error instanceof Error ? error.message : String(error),
          });
          return null;
        }
      },
    }),

    // Google OAuth (optional)
    ...(process.env['GOOGLE_CLIENT_ID'] && process.env['GOOGLE_CLIENT_SECRET']
      ? [
          GoogleProvider({
            clientId: process.env['GOOGLE_CLIENT_ID'],
            clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },
          }),
        ]
      : []),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/auth/welcome',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as AuthUser).role ?? UserRole.USER;
      }

      // OAuth sign in - sync with Supabase
      if (account?.provider === 'google' && user?.email) {
        const supabase = getSupabaseAdmin();
        
        // Check if user exists
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('id, role')
          .eq('email', user.email)
          .single();

        if (existingUser) {
          token.id = existingUser.id;
          token.role = existingUser.role as UserRole;
        } else {
          // Create new user profile
          const { data: newProfile } = await supabase
            .from('user_profiles')
            .insert({
              email: user.email,
              name: user.name,
              role: UserRole.USER,
              auth_provider: 'google',
            })
            .select()
            .single();

          if (newProfile) {
            token.id = newProfile.id;
            token.role = UserRole.USER;
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },

    async signIn({ user, account }) {
      // Allow all credential sign-ins that passed authorize()
      if (account?.provider === 'credentials') {
        return true;
      }

      // For OAuth, check if user email is verified
      if (account?.provider === 'google' && user.email) {
        logger.info('OAuth sign in', { 
          email: user.email, 
          provider: account.provider 
        });
        return true;
      }

      return false;
    },
  },

  events: {
    async signIn({ user }) {
      logger.info('User signed in', { userId: user.id });
    },
    async signOut({ token }) {
      logger.info('User signed out', { userId: token?.id });
    },
  },

  debug: process.env['NODE_ENV'] === 'development',
};

export default authOptions;
