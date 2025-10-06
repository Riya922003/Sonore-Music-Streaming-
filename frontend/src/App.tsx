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
              <MainContent />
            </div>
          </main>
          
          {/* Music Player - Fixed at bottom */}
          <MusicPlayer />
      </div>
      
      {/* Auth Modal */}
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} />}
    </div>
  );
}

export default App;
