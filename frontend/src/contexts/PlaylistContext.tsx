import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Song } from './PlayerContext';

// Playlist interface
export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

// Playlist context interface
interface PlaylistContextType {
  isAddToPlaylistModalOpen: boolean;
  selectedSong: Song | null;
  openAddToPlaylistModal: (song: Song) => void;
  closeAddToPlaylistModal: () => void;
}

// Create the context
const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

// Playlist provider props
interface PlaylistProviderProps {
  children: ReactNode;
}

// Playlist provider component
export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children }) => {
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const openAddToPlaylistModal = (song: Song) => {
    setSelectedSong(song);
    setIsAddToPlaylistModalOpen(true);
  };

  const closeAddToPlaylistModal = () => {
    setIsAddToPlaylistModalOpen(false);
    setSelectedSong(null);
  };

  const value: PlaylistContextType = {
    isAddToPlaylistModalOpen,
    selectedSong,
    openAddToPlaylistModal,
    closeAddToPlaylistModal,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

// Custom hook to use the playlist context
export const usePlaylist = (): PlaylistContextType => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};