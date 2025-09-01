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
  ChevronRight,
  LucideIcon
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const navigationItems: NavigationItem[] = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Search' },
    { icon: Library, label: 'Your Library' },
  ];

  const libraryItems: NavigationItem[] = [
    { icon: Plus, label: 'Create Playlist' },
    { icon: Heart, label: 'Liked Songs' },
    { icon: Download, label: 'Downloads' },
  ];

  const userItems: NavigationItem[] = [
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout' },
  ];

  return (
    <div className={`${
      isCollapsed ? 'w-16' : 'w-64'
    } bg-black border-r border-gray-800 h-screen fixed left-0 top-0 z-30 overflow-hidden transition-all duration-300 ease-in-out flex flex-col`}>
      
      {/* Logo and Toggle Button */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between min-h-[80px]">
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-xl font-bold text-green-500">Sonore</h1>
            <p className="text-gray-400 text-xs">Music Streaming</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800 flex-shrink-0"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {/* Navigation */}
        <nav className="mb-6">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <div 
                  className={`sidebar-item group ${item.active ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Library */}
        <div className="mb-6">
          {!isCollapsed && (
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
              Library
            </h3>
          )}
          <ul className="space-y-1">
            {libraryItems.map((item) => (
              <li key={item.label}>
                <div 
                  className={`sidebar-item group ${isCollapsed ? 'collapsed' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* User Section - Pinned to bottom */}
      <div className="p-2 border-t border-gray-800">
        {!isCollapsed && (
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
            User
          </h3>
        )}
        <ul className="space-y-1">
          {userItems.map((item) => (
            <li key={item.label}>
              <div 
                className={`sidebar-item group ${isCollapsed ? 'collapsed' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
