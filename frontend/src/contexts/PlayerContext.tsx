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
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
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

  // Function to play a song
  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  // Function to toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  };

  // Context value
  const value: PlayerContextType = {
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause
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