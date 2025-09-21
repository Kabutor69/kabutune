'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, Heart, Compass } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Music className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              KabuTune
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <Link
              href="/explore"
              className={`px-3 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 flex items-center space-x-2 ${
                pathname === '/explore'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Explore</span>
            </Link>
            <Link
              href="/"
              className={`px-3 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                pathname === '/'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              <span className="hidden sm:inline">Search</span>
              <span className="sm:hidden">Search</span>
            </Link>
            <Link
              href="/favorites"
              className={`px-3 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 flex items-center space-x-2 ${
                pathname === '/favorites'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
