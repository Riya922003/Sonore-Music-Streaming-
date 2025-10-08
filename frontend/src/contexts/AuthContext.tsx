import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
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

    try {
      const isLiked = user.likedSongs.includes(songId);
      console.log('AuthContext: toggleLike called', { songId, isLiked, currentLikedSongs: user.likedSongs });
      
      if (isLiked) {
        // Remove from liked songs
        console.log('AuthContext: Removing song from likes');
        await apiClient.delete(`/api/me/likes/${songId}`);
        setUser(prev => {
          if (!prev) return null;
          const newLikedSongs = prev.likedSongs.filter(id => id !== songId);
          console.log('AuthContext: Updated likedSongs after removal', { 
            before: prev.likedSongs, 
            after: newLikedSongs 
          });
          return {
            ...prev,
            likedSongs: newLikedSongs
          };
        });
      } else {
        // Add to liked songs
        console.log('AuthContext: Adding song to likes');
        await apiClient.post(`/api/me/likes/${songId}`);
        setUser(prev => {
          if (!prev) return null;
          const newLikedSongs = [...prev.likedSongs, songId];
          console.log('AuthContext: Updated likedSongs after addition', { 
            before: prev.likedSongs, 
            after: newLikedSongs 
          });
          return {
            ...prev,
            likedSongs: newLikedSongs
          };
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // If there's an error, refresh the liked songs from server to sync state
      console.log('Refreshing liked songs from server due to error');
      try {
        const likedSongs = await fetchLikedSongs();
        setUser(prev => prev ? { ...prev, likedSongs } : null);
      } catch (refreshError) {
        console.error('Error refreshing liked songs:', refreshError);
      }
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