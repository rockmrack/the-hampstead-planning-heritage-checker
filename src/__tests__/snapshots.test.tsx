/**
 * Snapshot Tests for UI Components
 * Ensures visual consistency of key components
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { render } from '@testing-library/react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

// Declare Jest globals for TypeScript
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: (value: any) => any;
declare const beforeAll: (fn: () => void) => void;
declare const afterAll: (fn: () => void) => void;
declare const jest: any;

describe('LoadingSpinner Snapshots', () => {
  it('renders default spinner correctly', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders small spinner correctly', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders large spinner correctly', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders spinner with custom class correctly', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('ErrorBoundary Snapshots', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when no error', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders error UI when child throws', () => {
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    const { container } = render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
