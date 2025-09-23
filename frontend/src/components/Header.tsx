'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  
  const linkClasses = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      pathname === path
        ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        : "text-cyan-300 hover:text-cyan-200 hover:bg-gray-800"
    }`;

  const iconClass = "w-4 h-4";

  return (
    <nav className="w-full sticky top-0 z-[70] border-b border-gray-800/80 bg-black/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold gradient-text">KabuTune</span>
         
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/" className={linkClasses("/")}>
            <Home className={iconClass} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link href="/favorites" className={linkClasses("/favorites")}>
            <Heart className={iconClass} />
            <span className="hidden sm:inline">Favorites</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
