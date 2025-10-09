import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SkeletonTheme } from 'react-loading-skeleton';
import Sidebar from './components/Sidebar.tsx';
import TopNav from './components/TopNav.tsx';
import MainContent from './components/MainContent.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import AuthModal from './components/AuthModal.tsx';
import SearchModal from './components/SearchModal.tsx';
import AddToPlaylistModal from './components/AddToPlaylistModal.tsx';
import LibraryModal from './components/LibraryModal.tsx';
import BlendModal from './components/BlendModal.tsx';
import VideoModal from './components/VideoModal.tsx';
import NowPlayingView from './components/NowPlayingView';
import { usePlayer } from './contexts/PlayerContext';
import PlaylistPage from './pages/PlaylistPage.tsx';
import LikedSongsPage from './pages/LikedSongsPage.tsx';
import { useAuth } from './contexts/AuthContext';
import { useSearch } from './contexts/SearchContext';
import { useUI } from './contexts/UIContext';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { currentSong } = usePlayer();
  const { isAuthModalOpen } = useAuth();
  const { isSearchOpen, openSearch } = useSearch();
  const { isBlendModalOpen, closeBlendModal, isVideoModalOpen, currentVideoId, closeVideoModal } = useUI();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Listen for Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        openSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openSearch]);

  return (
    <SkeletonTheme baseColor="#374151" highlightColor="#4b5563">
      <Router>
        <div className="App h-screen bg-black p-4 overflow-hidden">
          {/* Fixed Sidebar (positioned via its own CSS) */}
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

          {/* Main content wrapper - primary scrollable area. Padding adjusts based on sidebar and right panel presence */}
          <div
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out h-screen overflow-y-auto ${
              isSidebarCollapsed ? 'pl-24' : 'pl-72'
            } ${currentSong ? 'pr-96' : 'pr-8'}`}
          >
            {/* Top Navigation */}
            <TopNav />

            {/* Main Content */}
            <main className="flex-1 px-4 md:px-6 py-6 pb-32 bg-black min-w-0">
              <div className="w-full max-w-full">
                <Routes>
                  <Route path="/" element={<MainContent />} />
                  <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
                  <Route path="/liked-songs" element={<LikedSongsPage />} />
                </Routes>
              </div>
            </main>

            {/* Music Player - Fixed at bottom (kept here for logical grouping) */}
            <MusicPlayer />
          </div>

          {/* Right: Now Playing view (appears/disappears based on currentSong) as sibling */}
          {currentSong && (
            <div className="flex-shrink-0 ml-4">
              <NowPlayingView key={currentSong._id} />
            </div>
          )}
        </div>
        
        {/* Auth Modal */}
        {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} />}
        
        {/* Search Modal */}
        {isSearchOpen && <SearchModal />}
        
        {/* Library Modal */}
        <LibraryModal />
        
        {/* Add to Playlist Modal */}
        <AddToPlaylistModal />
        
        {/* Blend Modal */}
        {isBlendModalOpen && <BlendModal isOpen={isBlendModalOpen} onClose={closeBlendModal} />}
        
        {/* Video Modal */}
        <VideoModal 
          videoId={currentVideoId}
          isOpen={isVideoModalOpen}
          onClose={closeVideoModal}
        />
        
        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </SkeletonTheme>
  );
}

export default App;
