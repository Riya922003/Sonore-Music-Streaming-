import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Music, Clock, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { usePlayer, Song } from '../contexts/PlayerContext';
import { Playlist } from '../contexts/PlaylistContext';
import apiClient from '../api';

const PlaylistPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { playSong } = usePlayer();
  
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch playlist data
  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!playlistId) {
        setError('No playlist ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const response = await apiClient.get(`/api/playlists/${playlistId}`);
        setPlaylist(response.data);
      } catch (error: unknown) {
        console.error('Error fetching playlist:', error);
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(
          axiosError.response?.data?.message || 
          'Failed to load playlist. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

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
    if (playlist && playlist.songs) {
      playSong(song, playlist.songs);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-green-500" size={48} />
          <p className="text-gray-300">Loading playlist...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold mb-2">Error Loading Playlist</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  // No playlist found
  if (!playlist) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <Music className="mx-auto mb-4 text-gray-500" size={48} />
          <h2 className="text-xl font-semibold mb-2">Playlist Not Found</h2>
          <p className="text-gray-300">The playlist you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-y-auto">
      {/* Playlist Header */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8">
        <div className="flex items-end gap-6">
          {/* Playlist Thumbnail */}
          <div className="w-48 h-48 bg-gray-700 rounded-lg shadow-xl flex items-center justify-center flex-shrink-0">
            {playlist.songs && playlist.songs.length > 0 && playlist.songs[0].albumArt ? (
              <img 
                src={playlist.songs[0].albumArt} 
                alt={playlist.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Music size={64} className="text-gray-400" />
            )}
          </div>

          {/* Playlist Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-300 mb-2">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 truncate">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-gray-300 mb-4 text-lg">{playlist.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="font-medium">{playlist.createdBy.name}</span>
              <span>•</span>
              <span>{playlist.songs.length} songs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Songs Table */}
      <div className="p-8">
        {playlist.songs && playlist.songs.length > 0 ? (
          <div className="bg-gray-900/50 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[50px_1fr_1fr_150px_80px] gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
              <div className="text-center">#</div>
              <div>Title</div>
              <div>Album</div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                Date Added
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Clock size={14} />
              </div>
            </div>

            {/* Song Rows */}
            <div className="divide-y divide-gray-800">
              {playlist.songs.map((song, index) => (
                <div
                  key={song._id}
                  onClick={() => handleSongClick(song)}
                  className="grid grid-cols-[50px_1fr_1fr_150px_80px] gap-4 p-4 hover:bg-gray-800/50 transition-colors cursor-pointer group"
                >
                  {/* Track Number / Play Button */}
                  <div className="flex items-center justify-center">
                    <span className="text-gray-400 group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play 
                      size={16} 
                      className="text-white hidden group-hover:block fill-current" 
                    />
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3 min-w-0">
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
                      {song.title} {/* You might want to add an album field to Song interface */}
                    </p>
                  </div>

                  {/* Date Added */}
                  <div className="flex items-center">
                    <p className="text-gray-400 text-sm">
                      {song.createdAt ? formatDate(song.createdAt) : '--'}
                    </p>
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
            <Music className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-semibold mb-2">No songs in this playlist</h3>
            <p className="text-gray-400">Start adding songs to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;