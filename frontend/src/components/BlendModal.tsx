import React, { useState, useEffect } from 'react';
import { X, Loader2, ArrowLeft, Check, LogIn } from 'lucide-react';
import { Playlist } from '../contexts/PlaylistContext';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api';

interface BlendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'select' | 'name';

const BlendModal: React.FC<BlendModalProps> = ({ isOpen, onClose }) => {
  const { user, openAuthModal } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('select');
      setSelectedPlaylistIds([]);
      setNewPlaylistName('');
      setError('');
      fetchPlaylists();
    }
  }, [isOpen]);

  // Fetch user's playlists
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

  // Handle playlist selection
  const handlePlaylistToggle = (playlistId: string) => {
    setSelectedPlaylistIds(prev => {
      if (prev.includes(playlistId)) {
        return prev.filter(id => id !== playlistId);
      } else {
        return [...prev, playlistId];
      }
    });
  };

  // Move to next step
  const handleNext = () => {
    if (selectedPlaylistIds.length >= 2) {
      setCurrentStep('name');
    }
  };

  // Go back to previous step
  const handleBack = () => {
    setCurrentStep('select');
  };

  // Create blend playlist
  const handleCreateBlend = async () => {
    if (!newPlaylistName.trim()) {
      setError('Please enter a playlist name.');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Fetch full details for each selected playlist in parallel
      const playlistDetailsPromises = selectedPlaylistIds.map(id =>
        apiClient.get(`/api/playlists/${id}`)
      );

      const playlistResponses = await Promise.all(playlistDetailsPromises);
      
      // Combine all songs from all playlists
      const allSongs = playlistResponses.flatMap(response => response.data.songs);
      
      // Create array of unique song IDs using Set
      const uniqueSongIds = Array.from(new Set(allSongs.map(song => song._id)));

      // Create the new blend playlist
      await apiClient.post('/api/playlists', {
        name: newPlaylistName.trim(),
        songs: uniqueSongIds
      });

      // Success - close modal and maybe show success notification
      onClose();
      // You can add a success notification here if you have a notification system
      console.log('Blend playlist created successfully!');

    } catch (error) {
      console.error('Error creating blend playlist:', error);
      setError('Failed to create blend playlist. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-w-md w-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Blend Playlists</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Login Prompt */}
          <div className="p-6 text-center">
            <LogIn className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-medium text-white mb-2">Login Required</h3>
            <p className="text-gray-300 mb-6">
              Please log in to blend your playlists and create new ones.
            </p>
            <button
              onClick={() => {
                onClose();
                openAuthModal();
              }}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
            >
              Log In to Blend Playlists
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {currentStep === 'name' && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-white">
              {currentStep === 'select' ? 'Select Playlists to Blend' : 'Name Your Blend'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {currentStep === 'select' && (
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <p className="text-gray-400 text-sm mb-4">
                Select at least 2 playlists to create a blend
              </p>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />
                  <span className="ml-2 text-gray-400">Loading playlists...</span>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {playlists.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No playlists found. Create some playlists first!
                    </p>
                  ) : (
                    playlists.map(playlist => (
                      <div
                        key={playlist._id}
                        className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer"
                        onClick={() => handlePlaylistToggle(playlist._id)}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedPlaylistIds.includes(playlist._id)}
                            onChange={() => handlePlaylistToggle(playlist._id)}
                            className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          {selectedPlaylistIds.includes(playlist._id) && (
                            <Check className="absolute -top-0.5 -left-0.5 h-5 w-5 text-purple-500 pointer-events-none" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{playlist.name}</h3>
                          <p className="text-gray-400 text-sm">
                            {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 'name' && (
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">
                  Selected {selectedPlaylistIds.length} playlists
                </p>
                <div className="text-xs text-gray-500">
                  Songs from all selected playlists will be combined (duplicates removed)
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="playlistName" className="block text-sm font-medium text-gray-300 mb-2">
                  Playlist Name
                </label>
                <input
                  id="playlistName"
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter blend playlist name..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  disabled={isCreating}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          {currentStep === 'select' && (
            <button
              onClick={handleNext}
              disabled={selectedPlaylistIds.length < 2 || isLoading}
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Next ({selectedPlaylistIds.length}/2+ selected)
            </button>
          )}

          {currentStep === 'name' && (
            <button
              onClick={handleCreateBlend}
              disabled={!newPlaylistName.trim() || isCreating}
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Blend...
                </>
              ) : (
                'Create Blend'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlendModal;