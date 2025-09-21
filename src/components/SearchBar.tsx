'use client';

import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({ onSearch, onCancel, isLoading = false, placeholder = 'Search for music, artists, or albums...' }: SearchBarProps) {
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
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto px-4">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 text-muted-foreground transition-colors duration-300 ${
            query ? 'text-primary-500' : 'group-focus-within:text-primary-500'
          }`} />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-14 pr-32 py-4 border-2 border-input rounded-2xl bg-background/80 backdrop-blur-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base shadow-lg hover:shadow-lg-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        />

        {/* Clear Button */}
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-24 flex items-center pr-3 hover:bg-secondary/50 rounded-full p-1 transition-all duration-200 group/clear"
          >
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}

        {/* Search/Cancel Button */}
        <button
          type={isLoading ? "button" : "submit"}
          onClick={isLoading ? handleCancel : undefined}
          disabled={!query.trim() && !isLoading}
          className="absolute inset-y-1.5 right-1.5 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-lg-lg hover:scale-105 active:scale-95 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Search</span>
            </>
          )}
        </button>

        {/* Focus Ring */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Search Suggestions (Future Enhancement) */}
      {query && !isLoading && (
        <div className="mt-2 text-sm text-muted-foreground text-center">
          Press Enter to search or click the search button
        </div>
      )}
    </form>
  );
}
