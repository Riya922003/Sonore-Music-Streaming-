import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import apiClient from '../api';
import { usePlayer } from '../contexts/PlayerContext';

interface PlaylistItem {
  id: number;
  title: string;
  image: string;
  songCount: number;
}

interface AlbumItem {
  id: number;
  title: string;
  artist: string;
  image: string;
}

interface SongItem {
  id: number;
  title: string;
  artist: string;
  image: string;
}

// Backend song interface
interface Song {
  _id: string;
  title: string;
  artist: string;
  audioUrl: string;
  url: string;
  thumbnail: string;
  albumArt?: string;
  album?: string;
  duration?: number;
  genre?: string;
  language?: string;
  featured?: boolean;
  uploadedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

type MusicItem = PlaylistItem | AlbumItem | SongItem;

interface MusicSectionProps {
  title: string;
  fetchUrl: string;
  items?: MusicItem[];
  type?: 'playlist' | 'album' | 'song';
}

const MusicSection: React.FC<MusicSectionProps> = ({ title, fetchUrl, items, type = 'song' }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the fetchUrl to get data from the backend
        const response = await apiClient.get(fetchUrl);
        console.log(`API Response for ${fetchUrl}:`, response.data);
        
        // Handle different response formats
        const songsData = response.data;
        let allSongs: Song[] = [];
        
        if (Array.isArray(songsData)) {
          allSongs = songsData;
        } else if (songsData && Array.isArray(songsData.songs)) {
          allSongs = songsData.songs;
        } else if (songsData && songsData.data && Array.isArray(songsData.data)) {
          allSongs = songsData.data;
        } else {
          console.warn(`Unexpected API response format for ${fetchUrl}:`, songsData);
          allSongs = [];
        }

        // Client-side filtering as fallback (in case backend filtering doesn't work)
        const urlParams = new URLSearchParams(fetchUrl.split('?')[1] || '');
        const languageParam = urlParams.get('language');
        const genreParam = urlParams.get('genre');
        
        let filteredSongs = allSongs;
        
        // Apply language filter if specified and backend didn't filter properly
        if (languageParam && allSongs.length > 0) {
          const languageFiltered = allSongs.filter(song => 
            song.language?.toLowerCase() === languageParam.toLowerCase()
          );
          // Only use client-side filtering if backend returned unfiltered results
          if (languageFiltered.length > 0 && languageFiltered.length < allSongs.length) {
            filteredSongs = languageFiltered;
            console.log(`Client-side filtered ${allSongs.length} songs to ${filteredSongs.length} for language: ${languageParam}`);
          }
        }
        
        // Apply genre filter if specified and backend didn't filter properly
        if (genreParam && filteredSongs.length > 0) {
          const genreFiltered = filteredSongs.filter(song =>
            song.genre?.toLowerCase().includes(genreParam.toLowerCase())
          );
          if (genreFiltered.length > 0 && genreFiltered.length < filteredSongs.length) {
            filteredSongs = genreFiltered;
            console.log(`Client-side filtered for genre: ${genreParam}`);
          }
        }

        setSongs(filteredSongs);
      } catch (error) {
        console.error(`Failed to fetch songs from ${fetchUrl}:`, error);
        setError('Failed to load songs');
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [fetchUrl]);

  const handleSongClick = (song: Song) => {
    console.log('Original song data:', song);
    
    // TEMPORARY FIX: Use a working test audio URL that allows CORS
    const testAudioUrl = 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3';
    
    // Transform the song data to match the PlayerContext Song interface
    const playerSong = {
      ...song,
      audioUrl: testAudioUrl, // Use test URL instead of: song.url || song.audioUrl,
      albumArt: song.thumbnail || song.albumArt,
    };
    
    console.log('Transformed player song:', playerSong);
    console.log('Using test audio URL:', testAudioUrl);
    
    // Transform all songs in the current songs array for the queue
    const transformedSongs = songs.map(s => ({
      ...s,
      audioUrl: testAudioUrl, // Use test URL for all songs in queue
      albumArt: s.thumbnail || s.albumArt,
    }));
    
    playSong(playerSong, transformedSongs);
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="text-gray-400 text-center py-8">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="text-gray-400 text-center py-8">{error}</div>
      </section>
    );
  }

  // If items are provided (legacy support), use them instead of fetched songs
  // Ensure displayItems is always an array
  const displayItems = Array.isArray(items) ? items : Array.isArray(songs) ? songs : [];

  return (
    <section className="mb-12 w-full">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      {displayItems.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No songs available</div>
      ) : (
        <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
          <div className="flex gap-6 min-w-max">
            {displayItems.slice(0, 6).map((item) => {
              // Handle both Song objects and legacy MusicItem objects
              const isSong = '_id' in item;
              const displayItem = isSong ? item as Song : item as MusicItem;
              
              return (
                <div
                  key={isSong ? (displayItem as Song)._id : (displayItem as MusicItem).id}
                  className="bg-gray-900/50 p-4 rounded-lg hover:bg-gray-800/70 transition-all duration-300 group cursor-pointer flex-shrink-0 w-48 min-w-[192px] hover:scale-105"
                  onClick={isSong ? () => handleSongClick(displayItem as Song) : undefined}
                >
                  <div className="relative mb-4">
                    <img
                      src={isSong ? (displayItem as Song).thumbnail : (displayItem as MusicItem).image}
                      alt={displayItem.title}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop';
                      }}
                    />
                    <button className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200 shadow-lg">
                      <Play size={16} fill="currentColor" />
                    </button>
                  </div>
                  <h3 className="text-white font-semibold mb-2 truncate text-sm">{displayItem.title}</h3>
                  <p className="text-gray-400 text-xs truncate">
                    {isSong ? (displayItem as Song).artist : 
                     type === 'playlist' ? `${(displayItem as PlaylistItem).songCount} songs` : 
                     (displayItem as AlbumItem | SongItem).artist}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default MusicSection;
