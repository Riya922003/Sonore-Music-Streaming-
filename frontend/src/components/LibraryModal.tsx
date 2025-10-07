import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import { Playlist } from '../contexts/PlaylistContext';
import apiClient from '../api';

const LibraryModal: React.FC = () => {
  const { isLibraryModalOpen, closeLibraryModal } = useUI();
  const { user, openAuthModal } = useAuth();
  const [query, setQuery] = useState<string>('');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isLibraryModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLibraryModalOpen]);

  // Fetch playlists when modal opens
  useEffect(() => {
    if (isLibraryModalOpen) {
      fetchPlaylists();
    }
  }, [isLibraryModalOpen]);

  // Filter playlists when search query changes
  useEffect(() => {
    if (query.trim()) {
      const filtered = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(query.toLowerCase()) ||
        (playlist.description && playlist.description.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredPlaylists(filtered);
    } else {
      setFilteredPlaylists(playlists);
    }
  }, [query, playlists]);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('📚 Fetching user playlists from /api/playlists/my-playlists');
      const response = await apiClient.get('/api/playlists/my-playlists');
      console.log('✅ Playlists response:', response.data);
      
      setPlaylists(response.data);
    } catch (error) {
      console.error('🚨 Fetch playlists error:', error);
      setError('Unable to load your library right now.');
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle playlist selection
  const handlePlaylistSelect = () => {
    closeLibraryModal();
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeLibraryModal();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLibraryModal();
      }
    };

    if (isLibraryModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isLibraryModalOpen, closeLibraryModal]);

  // Clear search when modal closes
  useEffect(() => {
    if (!isLibraryModalOpen) {
      setQuery('');
      setError('');
    }
  }, [isLibraryModalOpen]);

  if (!isLibraryModalOpen) {
    return null;
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={handleOverlayClick}
      >
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Your Library</h2>
              <button
                onClick={closeLibraryModal}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Login Prompt */}
          <div className="p-6 text-center">
            <svg className="mx-auto mb-4 text-gray-400" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">Login Required</h3>
            <p className="text-gray-300 mb-6">
              Please log in to view and manage your personal music library.
            </p>
            <button
              onClick={() => {
                closeLibraryModal();
                openAuthModal();
              }}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Log In to Access Library
            </button>
          </div>
        </div>
      </div>
    );
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
            <h2 className="text-xl font-semibold text-white">Your Library</h2>
            <button
              onClick={closeLibraryModal}
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
              placeholder="Search your playlists..."
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
              <span className="ml-3 text-gray-300">Loading playlists...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-yellow-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-yellow-300 text-lg">Unable to load playlists</p>
              <p className="text-gray-400 text-sm mt-1">Please check your connection and try again</p>
              <button
                onClick={fetchPlaylists}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !error && query.trim() && filteredPlaylists.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-1v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-1" />
              </svg>
              <p className="text-gray-300 text-lg">No playlists found.</p>
              <p className="text-gray-400 text-sm mt-1">Try different keywords or create a new playlist.</p>
            </div>
          )}

          {!isLoading && !error && filteredPlaylists.length > 0 && (
            <div className="space-y-2">
              {filteredPlaylists.map((playlist) => (
                <Link
                  key={playlist._id}
                  to={`/playlist/${playlist._id}`}
                  onClick={handlePlaylistSelect}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors group"
                >
                  {/* Playlist Thumbnail - using first song's artwork or placeholder */}
                  <div className="w-12 h-12 rounded-lg mr-4 bg-gray-700 flex items-center justify-center overflow-hidden">
                    {playlist.songs.length > 0 && playlist.songs[0].albumArt ? (
                      <img
                        src={playlist.songs[0].albumArt}
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-1v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-1" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                      {playlist.description && ` • ${playlist.description}`}
                    </p>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && !error && !query.trim() && playlists.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-1v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-1" />
              </svg>
              <p className="text-gray-300 text-lg">No playlists yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first playlist to get started</p>
            </div>
          )}

          {!isLoading && !error && !query.trim() && playlists.length > 0 && (
            <div className="text-center py-4 border-b border-gray-700 mb-4">
              <p className="text-gray-400 text-sm">
                {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} in your library
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;