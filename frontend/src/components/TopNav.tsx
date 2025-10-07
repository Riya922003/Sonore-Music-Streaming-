import { Search, Bell, Settings, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';
import { useFocusTimer } from '../contexts/FocusTimerContext';
import StarBorder from './StarBorder';

const TopNav: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const { openSearch } = useSearch();
  const { isTimerActive, timeRemaining, formatTime } = useFocusTimer();

  const getUserInitial = (name: string | undefined) => {
    if (!name || name.length === 0) {
      return 'U'; // Default to 'U' for User if name is undefined or empty
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="sticky top-0 bg-black/95 backdrop-blur-md z-20 px-4 sm:px-6 py-4 border-b border-gray-800/50 w-full">
      <div className="flex items-center justify-between w-full">
        {/* Left spacer */}
        <div className="flex-1 min-w-0"></div>
        
        {/* Search Bar - Centered */}
        <div className="flex-2 max-w-sm mx-4 min-w-0">
          <div className="relative cursor-pointer" onClick={openSearch}>
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="What do you want to play?"
              readOnly
              className="w-full bg-gray-800 text-white placeholder-gray-400 px-8 sm:px-10 py-2 sm:py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 text-sm sm:text-base cursor-pointer"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs hidden sm:block">
              Ctrl+K
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
          {/* Focus Timer Display */}
          {isTimerActive && (
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 px-3 py-2 rounded-lg text-green-400 text-sm font-medium flex-shrink-0">
              <Clock size={16} />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}
          
          <button className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800 flex-shrink-0">
            <Bell size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800 flex-shrink-0">
            <Settings size={18} className="sm:w-5 sm:h-5" />
          </button>
          
          {/* Authentication Section */}
          {user ? (
            /* Logged in user */
            <div className="flex items-center gap-2">
              {/* User Avatar */}
              <div className="flex items-center gap-2 bg-gray-800 px-2 sm:px-3 py-2 rounded-lg border border-gray-700 flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {getUserInitial(user.name)}
                </div>
                <span className="text-white text-xs sm:text-sm font-medium hidden lg:block max-w-20 truncate">
                  {user.name || 'User'}
                </span>
              </div>
              
              {/* Logout Button */}
              {/* <button 
                onClick={logout}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
                title="Logout"
              >
                <LogOut size={18} />
                <span className="hidden md:block text-sm">Logout</span>
              </button> */}
            </div>


          ) : (
            /* Not logged in */
            <StarBorder 
              as="button"
              className="custom-class"
              color="white"
              speed="5s"
              thickness={3}
              onClick={openAuthModal}
            >
              Dive-in
            </StarBorder>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
