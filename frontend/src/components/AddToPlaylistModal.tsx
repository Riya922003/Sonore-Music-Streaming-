import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Loader2 } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { Playlist } from '../contexts/PlaylistContext';
import apiClient from '../api';

const AddToPlaylistModal: React.FC = () => {
  const { isAddToPlaylistModalOpen, songToAdd, closeAddToPlaylistModal } = useUI();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [showNewPlaylistForm, setShowNewPlaylistForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const [error, setError] = useState('');

  // Fetch user's playlists when modal opens
  useEffect(() => {
    if (isAddToPlaylistModalOpen) {
      fetchPlaylists();
    }
  }, [isAddToPlaylistModalOpen]);

  // Filter playlists based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (playlist.description && playlist.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPlaylists(filtered);
    } else {
      setFilteredPlaylists(playlists);
    }
  }, [searchQuery, playlists]);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/api/playlists/my-playlists');
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setError('Failed to load playlists. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!songToAdd) return;
    
    try {
      console.log('🎵 Adding song to playlist:', {
        playlistId,
        songId: songToAdd._id,
        songTitle: songToAdd.title,
        endpoint: `/api/playlists/${playlistId}/songs`,
        authToken: localStorage.getItem('authToken') ? 'Present' : 'Missing'
      });
      
      const response = await apiClient.post(`/api/playlists/${playlistId}/songs`, {
        songId: songToAdd._id
      });
      
      console.log('✅ Successfully added song to playlist:', response.data);
      closeAddToPlaylistModal();
      // You could add a toast notification here
    } catch (error) {
      console.error('❌ Error adding song to playlist:', error);
      const axiosError = error as { response?: { data?: { message?: string }, status?: number, headers?: unknown } };
      console.error('Error response:', axiosError.response?.data);
      console.error('Error status:', axiosError.response?.status);
      console.error('Error headers:', axiosError.response?.headers);
      
      let errorMessage = 'Failed to add song to playlist. Please try again.';
      if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Please log in to add songs to playlists.';
      } else if (axiosError.response?.status === 404) {
        errorMessage = 'Playlist not found. Please try again.';
      } else if (axiosError.response?.status === 400) {
        errorMessage = 'Invalid request. Please check the song and playlist.';
      }
      
      setError(errorMessage);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim() || !songToAdd) return;

    setIsCreatingPlaylist(true);
    setError('');

    try {
      // Create new playlist
      const playlistResponse = await apiClient.post('/api/playlists', {
        name: newPlaylistName.trim()
      });

      const newPlaylist = playlistResponse.data;

      // Add song to the newly created playlist
      await apiClient.post(`/api/playlists/${newPlaylist._id}/songs`, {
        songId: songToAdd._id
      });

      closeAddToPlaylistModal();
      setNewPlaylistName('');
      setShowNewPlaylistForm(false);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error creating playlist:', error);
      setError('Failed to create playlist. Please try again.');
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleClose = () => {
    closeAddToPlaylistModal();
    setSearchQuery('');
    setShowNewPlaylistForm(false);
    setNewPlaylistName('');
    setError('');
  };

  if (!isAddToPlaylistModalOpen || !songToAdd) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Add to Playlist</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-white focus:border-transparent outline-none text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-gray-400" size={24} />
              <span className="ml-2 text-gray-300">Loading playlists...</span>
            </div>
          ) : (
            <>
              {/* New Playlist Form */}
              {showNewPlaylistForm && (
                <div className="p-4 border-b border-gray-700 bg-gray-800">
                  <form onSubmit={handleCreatePlaylist}>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Playlist name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-white focus:border-transparent outline-none text-white placeholder-gray-400"
                        required
                      />
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={isCreatingPlaylist || !newPlaylistName.trim()}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isCreatingPlaylist ? (
                            <>
                              <Loader2 className="animate-spin mr-2" size={16} />
                              Creating...
                            </>
                          ) : (
                            'Create & Add Song'
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewPlaylistForm(false)}
                          className="px-4 py-2 text-gray-400 hover:text-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* New Playlist Button */}
              {!showNewPlaylistForm && (
                <div className="p-4 border-b border-gray-700">
                  <button
                    onClick={() => setShowNewPlaylistForm(true)}
                    className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-600 rounded-md hover:border-gray-500 hover:bg-gray-800 transition-colors"
                  >
                    <Plus size={16} className="text-gray-400" />
                    <span className="text-gray-300">Create new playlist</span>
                  </button>
                </div>
              )}

              {/* Playlist List */}
              <div className="p-4">
                {searchQuery.trim() ? (
                  // Show search results when searching
                  filteredPlaylists.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No playlists found matching your search.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredPlaylists.map((playlist) => (
                        <button
                          key={playlist._id}
                          onClick={() => handleAddToPlaylist(playlist._id)}
                          className="w-full text-left p-3 rounded-md hover:bg-gray-800 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white group-hover:text-green-400">
                                {playlist.name}
                              </p>
                              {playlist.description && (
                                <p className="text-sm text-gray-400 truncate">
                                  {playlist.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <Plus size={16} className="text-gray-400 group-hover:text-green-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )
                ) : (
                  // Show message when not searching - don't show existing playlists
                  <div className="text-center py-8">
                    <p className="text-gray-400">Search for playlists or create a new one</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;