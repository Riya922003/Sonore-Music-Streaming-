import React, { useState, useEffect } from 'react';
import { Heart, Play, Music, Clock, Calendar, Loader2, LogIn, HeartHandshake, Info } from 'lucide-react';
import { usePlayer, Song } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api';

const LikedSongsPage: React.FC = () => {
  const { playSong } = usePlayer();
  const { user, toggleLike, openAuthModal } = useAuth();
  
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch liked songs data initially
  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (!user) {
        setError('You must be logged in to view liked songs');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const response = await apiClient.get('/api/me/likes');
        setLikedSongs(response.data.likedSongs || []);
      } catch (error: unknown) {
        console.error('Error fetching liked songs:', error);
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(
          axiosError.response?.data?.message || 
          'Failed to load liked songs. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedSongs();
  }, [user]); // Only fetch when user changes

  // Update local liked songs when user's liked songs change  
  useEffect(() => {
    console.log('LikedSongsPage: user.likedSongs changed:', user?.likedSongs);
    
    if (!user) {
      console.log('No user - clearing songs');
      setLikedSongs([]);
      return;
    }

    if (!user.likedSongs || user.likedSongs.length === 0) {
      console.log('User has no liked songs - clearing list');
      setLikedSongs([]);
      return;
    }

    // Re-fetch liked songs from API to ensure sync
    const refreshLikedSongs = async () => {
      try {
        console.log('Re-fetching liked songs due to user.likedSongs change');
        setIsLoading(true);
        const response = await apiClient.get('/api/me/likes');
        const songs = response.data.likedSongs || [];
        console.log('Refreshed liked songs:', songs.map((s: Song) => ({ id: s._id, title: s.title })));
        setLikedSongs(songs);
      } catch (error) {
        console.error('Error refreshing liked songs:', error);
        setError('Failed to refresh liked songs');
      } finally {
        setIsLoading(false);
      }
    };

    refreshLikedSongs();
  }, [user, user?.likedSongs]); // Listen to user and likedSongs changes

  // Format duration from seconds to mm:ss
  const formatDuration = (seconds: number | undefined): string => {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle song click
  const handleSongClick = (song: Song) => {
    if (likedSongs && Array.isArray(likedSongs)) {
      playSong(song, likedSongs);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-green-500" size={48} />
          <p className="text-gray-300">Loading liked songs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="text-blue-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            We're having trouble loading your liked songs right now. This might be a temporary issue.
          </p>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-purple-900/20 to-gray-950 text-white">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <HeartHandshake className="text-white" size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Music Collection
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Sign in to access your personalized liked songs collection and discover your favorite tracks.
          </p>
          <button 
            onClick={openAuthModal} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <LogIn size={20} />
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-y-auto">
      {/* Liked Songs Header */}
      <div className="bg-gradient-to-b from-purple-800 to-gray-900 p-8">
        <div className="flex items-end gap-6">
          {/* Large Heart Icon */}
          <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-xl flex items-center justify-center flex-shrink-0">
            <Heart size={96} className="text-white" fill="currentColor" />
          </div>

          {/* Liked Songs Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-300 mb-2">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Liked Songs
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="font-medium">{user.name}</span>
              <span>•</span>
              <span>{likedSongs.length} songs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Songs Table */}
      <div className="p-8">
        {likedSongs && Array.isArray(likedSongs) && likedSongs.length > 0 ? (
          <div className="bg-gray-900/50 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[50px_1fr_1fr_150px_50px_80px] gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
              <div className="text-center">#</div>
              <div>Title</div>
              <div>Album</div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                Date Added
              </div>
              <div className="text-center">
                <Heart size={14} />
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Clock size={14} />
              </div>
            </div>

            {/* Song Rows */}
            <div className="divide-y divide-gray-800">
              {likedSongs.map((song, index) => (
                <div
                  key={song._id}
                  className="grid grid-cols-[50px_1fr_1fr_150px_50px_80px] gap-4 p-4 hover:bg-gray-800/50 transition-colors group"
                >
                  {/* Track Number / Play Button */}
                  <div 
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => handleSongClick(song)}
                  >
                    <span className="text-gray-400 group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play 
                      size={16} 
                      className="text-white hidden group-hover:block fill-current" 
                    />
                  </div>

                  {/* Title */}
                  <div 
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => handleSongClick(song)}
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                      {song.albumArt ? (
                        <img 
                          src={song.albumArt} 
                          alt={song.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Music size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate group-hover:text-green-400 transition-colors">
                        {song.title}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Album */}
                  <div className="flex items-center">
                    <p className="text-gray-300 truncate">
                      {song.title}
                    </p>
                  </div>

                  {/* Date Added */}
                  <div className="flex items-center">
                    <p className="text-gray-400 text-sm">
                      {song.createdAt ? formatDate(song.createdAt) : '--'}
                    </p>
                  </div>

                  {/* Heart/Like Button */}
                  <div className="flex items-center justify-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(song._id);
                      }}
                      className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                      title="Remove from liked songs"
                    >
                      <Heart 
                        size={16} 
                        className="text-red-500" 
                        fill="currentColor"
                      />
                    </button>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-end">
                    <p className="text-gray-400 text-sm">
                      {formatDuration(song.duration)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-semibold mb-2">No liked songs yet</h3>
            <p className="text-gray-400">Songs you like will appear here. Start exploring and like some songs!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongsPage;