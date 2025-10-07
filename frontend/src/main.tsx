import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import { PlayerProvider } from './contexts/PlayerContext'
import { SearchProvider } from './contexts/SearchContext'
import { PlaylistProvider } from './contexts/PlaylistContext'
import { UIProvider } from './contexts/UIContext'
import { FocusTimerProvider } from './contexts/FocusTimerContext'
import './index.css'
import App from './App.tsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <PlayerProvider>
          <PlaylistProvider>
            <UIProvider>
              <SearchProvider>
                <FocusTimerProvider>
                  <App />
                </FocusTimerProvider>
              </SearchProvider>
            </UIProvider>
          </PlaylistProvider>
        </PlayerProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
