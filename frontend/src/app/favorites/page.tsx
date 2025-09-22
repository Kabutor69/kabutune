import React from 'react';
import { FavoritesContent } from './FavoritesContent';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Disable static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function FavoritesPage() {
  return (
    <ErrorBoundary>
      <FavoritesContent />
    </ErrorBoundary>
  );
}