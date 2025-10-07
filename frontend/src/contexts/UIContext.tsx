import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Song } from './PlayerContext';

// UI context interface
interface UIContextType {
  // Add to Playlist Modal state
  songToAdd: Song | null;
  isAddToPlaylistModalOpen: boolean;
  openAddToPlaylistModal: (song: Song) => void;
  closeAddToPlaylistModal: () => void;
  
  // Create Playlist Modal state
  openCreatePlaylistModal: () => void;
  
  // Library Modal state
  isLibraryModalOpen: boolean;
  openLibraryModal: () => void;
  closeLibraryModal: () => void;
}

// Create the context
const UIContext = createContext<UIContextType | undefined>(undefined);

// UI provider props
interface UIProviderProps {
  children: ReactNode;
}

// UI provider component
export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [songToAdd, setSongToAdd] = useState<Song | null>(null);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);

  const openAddToPlaylistModal = (song: Song) => {
    setSongToAdd(song);
    setIsAddToPlaylistModalOpen(true);
  };

  const closeAddToPlaylistModal = () => {
    setIsAddToPlaylistModalOpen(false);
    setSongToAdd(null);
  };

  const openCreatePlaylistModal = () => {
    setSongToAdd(null); // No song to add, just creating a playlist
    setIsAddToPlaylistModalOpen(true);
  };

  const openLibraryModal = () => {
    setIsLibraryModalOpen(true);
  };

  const closeLibraryModal = () => {
    setIsLibraryModalOpen(false);
  };

  const value: UIContextType = {
    songToAdd,
    isAddToPlaylistModalOpen,
    openAddToPlaylistModal,
    closeAddToPlaylistModal,
    openCreatePlaylistModal,
    isLibraryModalOpen,
    openLibraryModal,
    closeLibraryModal,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

// Custom hook to use the UI context
export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};