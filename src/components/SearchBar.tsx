'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({ onSearch, onCancel, isLoading = false, placeholder = 'Search for music...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-12 sm:pl-14 pr-24 sm:pr-28 py-4 sm:py-5 border-2 border-gray-200/60 dark:border-gray-700/60 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl"
          disabled={isLoading}
        />
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-16 sm:right-20 pr-3 sm:pr-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 transition-all duration-200"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
          </button>
        )}
        <button
          type={isLoading ? "button" : "submit"}
          onClick={isLoading ? handleCancel : undefined}
          disabled={!query.trim() && !isLoading}
          className="absolute inset-y-1.5 right-1.5 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
        >
          {isLoading ? 'Cancel' : 'Search'}
        </button>
      </div>
    </form>
  );
}
