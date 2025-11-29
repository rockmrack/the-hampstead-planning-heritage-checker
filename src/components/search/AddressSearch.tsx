/**
 * Address Search Component
 * Autocomplete search input for addresses using Mapbox Geocoding
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';

import { geocodeAddress } from '@/services/geocoding';
import { cn, debounce } from '@/lib/utils';
import { SEARCH_CONFIG } from '@/lib/config';
import type { GeocodingResult, Coordinates } from '@/types';

interface AddressSearchProps {
  onSelect: (result: GeocodingResult) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  initialValue?: string;
}

export default function AddressSearch({
  onSelect,
  onSearch,
  placeholder = 'Enter a property address in North West London...',
  className,
  disabled = false,
  initialValue = '',
}: AddressSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string): Promise<void> => {
      if (searchQuery.length < SEARCH_CONFIG.autocompleteMinChars) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await geocodeAddress(searchQuery);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
        setHighlightedIndex(-1);
      } catch (err) {
        setError('Unable to search addresses. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, SEARCH_CONFIG.autocompleteDebounceMs),
    []
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
    debouncedSearch(value);
  };

  // Handle result selection
  const handleSelect = (result: GeocodingResult) => {
    setQuery(result.placeName);
    setResults([]);
    setIsOpen(false);
    onSelect(result);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev: number) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev: number) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Clear input
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pl-12 pr-10 py-4 text-lg rounded-xl border-2 border-gray-200',
            'focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 focus:outline-none',
            'transition-all duration-200',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          )}
          aria-label="Search for a property address"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        {query && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
          role="listbox"
        >
          {results.map((result, index) => (
            <button
              key={`${result.placeName}-${index}`}
              type="button"
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                'w-full px-4 py-3 text-left flex items-start gap-3 transition-colors',
                highlightedIndex === index
                  ? 'bg-[#D4AF37]/10'
                  : 'hover:bg-gray-50'
              )}
              role="option"
              aria-selected={highlightedIndex === index}
            >
              <MapPin
                className={cn(
                  'w-5 h-5 mt-0.5 flex-shrink-0',
                  highlightedIndex === index
                    ? 'text-[#D4AF37]'
                    : 'text-gray-400'
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {result.placeName}
                </p>
                {result.postcode && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {result.postcode}
                    {result.borough && ` • ${result.borough}`}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Coverage Area Hint */}
      <p className="mt-2 text-xs text-gray-500">
        Coverage: NW1, NW3, NW6, NW8, NW11, N2, N6, N10 (Camden, Barnet, Westminster, Haringey, Brent)
      </p>
    </div>
  );
}
