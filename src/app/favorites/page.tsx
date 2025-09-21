import React from 'react';
import { FavoritesContent } from './FavoritesContent';

// Disable static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function FavoritesPage() {
  return <FavoritesContent />;
}
