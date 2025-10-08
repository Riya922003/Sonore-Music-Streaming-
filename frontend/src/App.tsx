import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import TopNav from './components/TopNav.tsx';
import MainContent from './components/MainContent.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import AuthModal from './components/AuthModal.tsx';
import SearchModal from './components/SearchModal.tsx';
import AddToPlaylistModal from './components/AddToPlaylistModal.tsx';
import LibraryModal from './components/LibraryModal.tsx';
import BlendModal from './components/BlendModal.tsx';
import PlaylistPage from './pages/PlaylistPage.tsx';
import { useAuth } from './contexts/AuthContext';
import { useSearch } from './contexts/SearchContext';
import { useUI } from './contexts/UIContext';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthModalOpen } = useAuth();
  const { isSearchOpen, openSearch } = useSearch();
  const { isBlendModalOpen, closeBlendModal } = useUI();

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
    <Router>
      <div className="App min-h-screen bg-black p-4 overflow-hidden">
        {/* Fixed Sidebar */}
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        
        {/* Main Content Area with margin for sidebar */}
        <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-24' : 'ml-72'
        }`}>
            {/* Top Navigation */}
            <TopNav />
            
            {/* Main Content */}
            <main className="flex-1 px-4 md:px-6 py-6 pb-32 bg-black overflow-y-auto min-w-0">
              <div className="w-full max-w-full">
                <Routes>
                  <Route path="/" element={<MainContent />} />
                  <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
                </Routes>
              </div>
            </main>
            
            {/* Music Player - Fixed at bottom */}
            <MusicPlayer />
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
      </div>
    </Router>
  );
}

export default App;
