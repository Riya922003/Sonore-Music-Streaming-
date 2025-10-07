import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import { PlayerProvider } from './contexts/PlayerContext'
import { SearchProvider } from './contexts/SearchContext'
import './index.css'
import App from './App.tsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <PlayerProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </PlayerProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
