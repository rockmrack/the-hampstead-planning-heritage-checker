/**
 * Application Providers
 * Central wrapper for all context providers
 */

'use client';

import { ReactNode } from 'react';
import AuthProvider from './AuthProvider';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
