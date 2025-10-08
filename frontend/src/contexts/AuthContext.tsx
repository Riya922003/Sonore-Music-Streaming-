import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import apiClient from '../api';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  likedSongs: string[];
}

// JWT payload interface
interface JWTPayload {
  id: string;
  name: string;
  email: string;
  exp: number;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  login: (token: string) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  toggleLike: (songId: string) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check for existing token on initial load
  useEffect(() => {
    const checkExistingToken = () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const decoded = jwtDecode<JWTPayload>(token);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp > currentTime) {
            // Token is valid, set user with empty liked songs initially
            setUser({
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              likedSongs: []
            });
            // Fetch liked songs after setting user
            fetchLikedSongs().then(likedSongs => {
              setUser(prev => prev ? { ...prev, likedSongs } : null);
            });
          } else {
            // Token is expired, remove it
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Error checking existing token:', error);
        // If there's an error decoding, remove the invalid token
        localStorage.removeItem('authToken');
      }
    };

    checkExistingToken();
  }, []);

  // Login function
  const login = (token: string) => {
    try {
      // Save token to localStorage
      localStorage.setItem('authToken', token);
      
      // Decode token to get user data
      const decoded = jwtDecode<JWTPayload>(token);
      
      // Set user state initially with empty liked songs
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        likedSongs: []
      });
      
      // Fetch liked songs after setting user
      fetchLikedSongs().then(likedSongs => {
        setUser(prev => prev ? { ...prev, likedSongs } : null);
      });
      
      // Close auth modal
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Error during login:', error);
      // If decoding fails, don't save the token
      localStorage.removeItem('authToken');
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    
    // Set user state to null
    setUser(null);
  };

  // Open auth modal
  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  // Close auth modal
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Fetch user's liked songs
  const fetchLikedSongs = async () => {
    try {
      const response = await apiClient.get('/api/me/likes');
      return response.data.likedSongs.map((song: { _id: string }) => song._id);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
      return [];
    }
  };

  // Toggle like function
  const toggleLike = async (songId: string) => {
    if (!user) return;

    const isLiked = user.likedSongs.includes(songId);
    
    // Update local state immediately for fast UI response
    setUser(prev => {
      if (!prev) return null;
      
      if (isLiked) {
        // Remove song from liked songs
        return {
          ...prev,
          likedSongs: prev.likedSongs.filter(id => id !== songId)
        };
      } else {
        // Add song to liked songs
        return {
          ...prev,
          likedSongs: [...prev.likedSongs, songId]
        };
      }
    });

    // Make API call in background
    try {
      if (isLiked) {
        // Remove from liked songs
        await apiClient.delete(`/api/me/likes/${songId}`);
        toast.success('Song removed from liked songs!');
      } else {
        // Add to liked songs
        await apiClient.post(`/api/me/likes/${songId}`);
        toast.success('Song liked!');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Show error toast
      toast.error('Failed to update liked songs. Please try again.');
      
      // Revert local state on API error
      setUser(prev => {
        if (!prev) return null;
        
        if (isLiked) {
          // Revert removal - add the song back
          return {
            ...prev,
            likedSongs: [...prev.likedSongs, songId]
          };
        } else {
          // Revert addition - remove the song
          return {
            ...prev,
            likedSongs: prev.likedSongs.filter(id => id !== songId)
          };
        }
      });
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    isAuthModalOpen,
    login,
    logout,
    openAuthModal,
    closeAuthModal,
    toggleLike
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};