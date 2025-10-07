import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '../contexts/SearchContext';
import { usePlayer, Song } from '../contexts/PlayerContext';
import apiClient from '../api';

// Custom useDebounce hook
const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface SearchResult {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  language: string;
  duration: number;
  url: string;
  thumbnail: string;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch } = useSearch();
  const { playSong } = usePlayer();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search query by 150ms (faster response)
  const debouncedQuery = useDebounce(query, 150);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Search when debounced query changes
  useEffect(() => {
    const searchSongs = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      console.log('🔍 Searching for:', debouncedQuery); // Debug log
      
      try {
        const response = await apiClient.get(`/api/songs/search?q=${encodeURIComponent(debouncedQuery)}`);
        console.log('📦 Search response:', response.data); // Debug log
        
        if (response.data.success) {
          setResults(response.data.songs);
          console.log('✅ Found songs:', response.data.songs.length); // Debug log
        } else {
          console.log('❌ Search failed:', response.data.message); // Debug log
          setResults([]);
        }
      } catch (error) {
        console.error('🚨 Search error:', error);
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { status: number; data: unknown } };
          console.error('Response status:', axiosError.response.status);
          console.error('Response data:', axiosError.response.data);
        }
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchSongs();
  }, [debouncedQuery]);

  // Handle song selection
  const handleSongSelect = (song: SearchResult) => {
    // Transform SearchResult to Song interface
    const playerSong: Song = {
      _id: song._id,
      title: song.title,
      artist: song.artist,
      albumArt: song.thumbnail,
      audioUrl: song.url,
      duration: song.duration,
      uploadedBy: song.uploadedBy,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
    };

    // Play the song with an empty queue (single song)
    playSong(playerSong, [playerSong]);
    closeSearch();
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeSearch();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen, closeSearch]);

  // Clear search when modal closes
  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Search Songs</h2>
              <button
                onClick={closeSearch}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by title, artist, genre, or language..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent outline-none text-white placeholder-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-gray-300">Searching...</span>
              </div>
            )}

            {!isLoading && query.trim() && results.length === 0 && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.071 2.328A3.988 3.988 0 006 21h12a3.988 3.988 0 00.071-2.672z" />
                </svg>
                <p className="text-gray-300 text-lg">No results found.</p>
                <p className="text-gray-400 text-sm mt-1">Try different keywords or check your spelling.</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="space-y-2">
                {results.map((song) => (
                  <div
                    key={song._id}
                    onClick={() => handleSongSelect(song)}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors group"
                  >
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-12 h-12 rounded-lg object-cover mr-4"
                  />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {song.artist} • {song.genre} • {song.language}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !query.trim() && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-300 text-lg">Start typing to search</p>
                <p className="text-gray-400 text-sm mt-1">Find songs by title, artist, genre, or language</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;