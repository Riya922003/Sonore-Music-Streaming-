import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Download, 
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const navigationItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Search' },
    { icon: Library, label: 'Your Library' },
  ];

  const libraryItems = [
    { icon: Plus, label: 'Create Playlist' },
    { icon: Heart, label: 'Liked Songs' },
    { icon: Download, label: 'Downloads' },
  ];

  const userItems = [
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout' },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-spotify-black h-screen fixed left-0 top-0 p-6 overflow-y-auto transition-all duration-300 ease-in-out`}>
      {/* Logo */}
      <div className="mb-8 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h1 className="text-2xl font-bold text-spotify-green">Sonore</h1>
            <p className="text-spotify-text-secondary text-sm">Music Streaming</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-spotify-text-secondary hover:text-spotify-content transition-colors duration-200 p-2 rounded-full hover:bg-spotify-light-gray"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mb-8">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <div 
                className={`sidebar-item ${item.active ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon size={20} className="text-spotify-text-secondary" />
                {!isCollapsed && item.label}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Library */}
      <div className="mb-8">
        {!isCollapsed && (
          <h3 className="text-spotify-text-secondary text-xs font-semibold uppercase tracking-wider mb-4">
            Library
          </h3>
        )}
        <ul className="space-y-2">
          {libraryItems.map((item) => (
            <li key={item.label}>
              <div 
                className={`sidebar-item ${isCollapsed ? 'collapsed' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon size={20} className="text-spotify-text-secondary" />
                {!isCollapsed && item.label}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* User */}
      <div className="mt-auto">
        {!isCollapsed && (
          <h3 className="text-spotify-text-secondary text-xs font-semibold uppercase tracking-wider mb-4">
            User
          </h3>
        )}
        <ul className="space-y-2">
          {userItems.map((item) => (
            <li key={item.label}>
              <div 
                className={`sidebar-item ${isCollapsed ? 'collapsed' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon size={20} className="text-spotify-text-secondary" />
                {!isCollapsed && item.label}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 