import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
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
            // Token is valid
            setUser({
              id: decoded.id,
              name: decoded.name,
              email: decoded.email
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
      
      // Set user state
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email
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

  // Context value
  const value: AuthContextType = {
    user,
    isAuthModalOpen,
    login,
    logout,
    openAuthModal,
    closeAuthModal
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