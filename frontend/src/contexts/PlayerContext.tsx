import React, { createContext, useContext, useState, ReactNode } from 'react';

// Song interface - you can adjust this based on your Song model structure
export interface Song {
  _id: string;
  title: string;
  artist: string;
  albumArt?: string;
  audioUrl: string;
  duration?: number;
  uploadedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Player context interface
interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentQueueIndex: number;
  playSong: (song: Song, songList: Song[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayer: () => void;
}

// Create the context
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Player provider props
interface PlayerProviderProps {
  children: ReactNode;
}

// Player provider component
export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);

  // Function to play a song with its song list
  const playSong = (song: Song, songList: Song[]) => {
    setQueue(songList);
    const songIndex = songList.findIndex(s => s._id === song._id);
    setCurrentQueueIndex(songIndex !== -1 ? songIndex : 0);
    setCurrentSong(song);
    setIsPlaying(true);
  };

  // Function to toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  };

  // Function to play next song
  const playNext = () => {
    if (queue.length === 0) return;
    
    const nextIndex = (currentQueueIndex + 1) % queue.length;
    setCurrentQueueIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  };

  // Function to play previous song
  const playPrevious = () => {
    if (queue.length === 0) return;
    
    const prevIndex = currentQueueIndex === 0 ? queue.length - 1 : currentQueueIndex - 1;
    setCurrentQueueIndex(prevIndex);
    setCurrentSong(queue[prevIndex]);
    setIsPlaying(true);
  };

  // Function to clear the player (stop and remove current song)
  const clearPlayer = () => {
    setCurrentSong(null);
    setIsPlaying(false);
    setQueue([]);
    setCurrentQueueIndex(0);
  };

  // Context value
  const value: PlayerContextType = {
    currentSong,
    isPlaying,
    queue,
    currentQueueIndex,
    playSong,
    togglePlayPause,
    playNext,
    playPrevious
    ,
    clearPlayer
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook to use player context
export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};