import { Search, Bell, Home, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TopNavProps {
  isSidebarCollapsed: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ isSidebarCollapsed }) => {
  const { user, logout, openAuthModal } = useAuth();

  const getUserInitial = (name: string | undefined) => {
    if (!name || name.length === 0) {
      return 'U'; // Default to 'U' for User if name is undefined or empty
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`fixed top-0 right-0 bg-black/95 backdrop-blur-md z-20 px-6 py-4 transition-all duration-300 ease-in-out ${
      isSidebarCollapsed ? 'left-16' : 'left-64'
    }`}>
      <div className="flex items-center justify-between max-w-full">
        {/* Left Navigation */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
            <ChevronLeft size={20} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
            <ChevronRight size={20} />
          </button>
          <button className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
            <Home size={20} />
          </button>
        </div>

        {/* Search Bar - Centered */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="What do you want to play?"
              className="w-full bg-gray-800 text-white placeholder-gray-400 px-10 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
            <Bell size={20} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
            <Settings size={20} />
          </button>
          
          {/* Authentication Section */}
          {user ? (
            /* Logged in user */
            <div className="flex items-center gap-2">
              {/* User Avatar */}
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {getUserInitial(user.name)}
                </div>
                <span className="text-white text-sm font-medium hidden md:block">
                  {user.name || 'User'}
                </span>
              </div>
              
              {/* Logout Button */}
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
                title="Logout"
              >
                <LogOut size={18} />
                <span className="hidden md:block text-sm">Logout</span>
              </button>
            </div>
          ) : (
            /* Not logged in */
            <button 
              onClick={openAuthModal}
              className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Sign Up / Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
