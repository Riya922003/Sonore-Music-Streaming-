import { useState, useEffect, useRef } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playSong } = usePlayer();

  // Generate a unique placeholder image based on song title and artist
  const getPlaceholderImage = (song: Song) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
    const hash = (song.title + song.artist).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const colorIndex = Math.abs(hash) % colors.length;
    const color = colors[colorIndex];
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${color}"/>
        <circle cx="100" cy="100" r="40" fill="white" opacity="0.2"/>
        <path d="M85 85V115L110 100L85 85Z" fill="white" opacity="0.8"/>
      </svg>
    `)}`;
  };

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const canScrollLeft = scrollLeft > 10;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 10;
      
      setShowLeftArrow(canScrollLeft);
      setShowRightArrow(canScrollRight);
      
      // Debug log
      console.log('Scroll check:', { scrollLeft, scrollWidth, clientWidth, canScrollLeft, canScrollRight });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        console.log(`🚀 Starting to fetch songs for "${title}" from: ${fetchUrl}`);
        setIsLoading(true);
        setError(null);
        
        // Use the fetchUrl to get data from the backend
        const response = await apiClient.get(fetchUrl);
        console.log(`✅ API Response for ${fetchUrl}:`, response.data);
        
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
        console.error(`❌ Failed to fetch songs for "${title}" from ${fetchUrl}:`, error);
        console.error('Error details:', error.message);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
        setError('Failed to load songs');
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [fetchUrl, title]);

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);

    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
        clearTimeout(timer);
      };
    }

    return () => clearTimeout(timer);
  }, [songs.length]);

  const handleSongClick = (song: Song) => {
    console.log('Original song data:', song);
    
    // Transform the song data to match the PlayerContext Song interface
    const playerSong = {
      ...song,
      audioUrl: song.url || song.audioUrl,
      albumArt: song.thumbnail || song.albumArt,
    };
    
    console.log('Transformed player song:', playerSong);
    console.log('Using actual song URL:', playerSong.audioUrl);
    
    // Transform all songs in the current songs array for the queue
    const transformedSongs = songs.map(s => ({
      ...s,
      audioUrl: s.url || s.audioUrl,
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
    <section className="mb-12 w-full group">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      {displayItems.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No songs available</div>
      ) : (
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/90 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl border border-gray-700"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/90 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl border border-gray-700"
            >
              <ChevronRight size={24} />
            </button>
          )}
          
          <div 
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-6 min-w-max px-2">
              {displayItems.map((item) => {
              // Handle both Song objects and legacy MusicItem objects
              const isSong = '_id' in item;
              const displayItem = isSong ? item as Song : item as MusicItem;
              
              // Debug logging to see song data
              if (isSong) {
                console.log('Song data:', {
                  title: (displayItem as Song).title,
                  thumbnail: (displayItem as Song).thumbnail,
                  albumArt: (displayItem as Song).albumArt,
                  artist: (displayItem as Song).artist
                });
              }
              
              return (
                <div
                  key={isSong ? (displayItem as Song)._id : (displayItem as MusicItem).id}
                  className="bg-gray-900/50 p-4 rounded-lg hover:bg-gray-800/70 transition-all duration-300 group/card cursor-pointer flex-shrink-0 w-[200px] max-w-[200px] min-w-[200px] hover:scale-105"
                  onClick={isSong ? () => handleSongClick(displayItem as Song) : undefined}
                >
                  <div className="relative mb-4">
                    <img
                      src={isSong ? 
                        (displayItem as Song).thumbnail || 
                        (displayItem as Song).albumArt || 
                        getPlaceholderImage(displayItem as Song)
                        : (displayItem as MusicItem).image
                      }
                      alt={displayItem.title}
                      className="w-[168px] h-[168px] object-cover rounded-lg transition-transform duration-300"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (isSong && !target.dataset.fallbackAttempt) {
                          // First fallback: use our unique placeholder
                          target.dataset.fallbackAttempt = '1';
                          target.src = getPlaceholderImage(displayItem as Song);
                        } else if (target.dataset.fallbackAttempt === '1') {
                          // Second fallback: use a music-themed image with unique identifier
                          target.dataset.fallbackAttempt = '2';
                          const songHash = Math.abs((displayItem.title).split('').reduce((a, b) => {
                            a = ((a << 5) - a) + b.charCodeAt(0);
                            return a & a;
                          }, 0));
                          target.src = `https://picsum.photos/200/200?random=${songHash % 1000}`;
                        } else {
                          // Final fallback: generic music placeholder
                          target.dataset.fallbackAttempt = '3';
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzc0MTUxIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM2Qjc0ODgiLz4KPHBhdGggZD0iTTg1IDg1VjExNUwxMTAgMTAwTDg1IDg1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                        }
                      }}
                    />
                    <button className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover/card:opacity-100 hover:scale-110 transition-all duration-200 shadow-lg">
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
        </div>
      )}
    </section>
  );
};

export default MusicSection;
