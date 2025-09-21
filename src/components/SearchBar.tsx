'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({ 
  onSearch, 
  onCancel, 
  isLoading = false, 
  placeholder = 'Search for music, artists, or albums...' 
}: SearchBarProps) {
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
          <Search className="h-5 w-5 text-text-muted" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input pl-12 pr-24"
          disabled={isLoading}
        />

        {/* Clear Button */}
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-16 flex items-center pr-3 hover:bg-surface rounded-md"
          >
            <X className="h-4 w-4 text-text-muted hover:text-text" />
          </button>
        )}

        {/* Search/Cancel Button */}
        <button
          type={isLoading ? "button" : "submit"}
          onClick={isLoading ? handleCancel : undefined}
          disabled={!query.trim() && !isLoading}
          className="absolute inset-y-1 right-1 px-4 py-1.5 bg-accent text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="loading w-4 h-4"></div>
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