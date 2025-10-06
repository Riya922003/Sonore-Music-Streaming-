import { useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import TopNav from './components/TopNav.tsx';
import MainContent from './components/MainContent.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import AuthModal from './components/AuthModal.tsx';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthModalOpen } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="App min-h-screen bg-black">
      <div className={`grid transition-all duration-300 ease-in-out min-h-screen ${
        isSidebarCollapsed ? 'grid-cols-[64px_1fr]' : 'grid-cols-[256px_1fr]'
      }`}>
        {/* Sidebar */}
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        
        {/* Main Content Area */}
        <div className="flex flex-col min-w-0">
        {/* Top Navigation */}
        <TopNav />
        
        {/* Main Content with proper spacing and responsive padding */}
        <main className="flex-1 px-4 md:px-6 py-6 pb-32 bg-black overflow-y-auto">
          <div className="w-full">
            <MainContent />
          </div>
        </main>
        
        {/* Music Player - Fixed at bottom */}
        <MusicPlayer />
        </div>
      </div>
      
      {/* Auth Modal */}
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} />}
    </div>
  );
}

export default App;
