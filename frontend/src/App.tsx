import { useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import TopNav from './components/TopNav.tsx';
import MainContent from './components/MainContent.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="App flex min-h-screen bg-black">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      
      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      } md:${isSidebarCollapsed ? 'ml-16' : 'ml-64'} sm:ml-0`}>
        {/* Top Navigation */}
        <TopNav isSidebarCollapsed={isSidebarCollapsed} />
        
        {/* Main Content with proper spacing and responsive padding */}
        <main className="flex-1 px-4 md:px-6 pt-20 pb-32 overflow-y-auto bg-black">
          <MainContent />
        </main>
        
        {/* Music Player - Fixed at bottom */}
        <MusicPlayer />
      </div>
    </div>
  );
}

export default App;
