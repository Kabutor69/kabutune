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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-12 pr-24 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        />

        {/* Clear Button */}
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-16 flex items-center pr-3 hover:bg-muted rounded-md p-1 transition-colors duration-200"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}

        {/* Search/Cancel Button */}
        <button
          type={isLoading ? "button" : "submit"}
          onClick={isLoading ? handleCancel : undefined}
          disabled={!query.trim() && !isLoading}
          className="absolute inset-y-1 right-1 px-4 py-1.5 bg-primary text-primary-foreground rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
      </div>
    </form>
  );
}
