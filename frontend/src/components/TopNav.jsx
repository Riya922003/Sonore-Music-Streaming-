import { Search, Bell, User, ChevronLeft, ChevronRight } from 'lucide-react';

const TopNav = () => {
  return (
    <div className="fixed top-0 right-0 left-64 bg-spotify-dark-gray/90 backdrop-blur-md z-10 px-8 py-4 border-b border-spotify-light-gray">
      <div className="flex items-center justify-between">
        {/* Navigation Controls */}
        <div className="flex items-center gap-4">
          <button className="bg-spotify-black p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200 text-spotify-content">
            <ChevronLeft size={20} />
          </button>
          <button className="bg-spotify-black p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200 text-spotify-content">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text-secondary" />
            <input
              type="text"
              placeholder="Search for songs, artists, or playlists..."
              className="w-full bg-spotify-light-gray text-spotify-content placeholder-spotify-text-secondary px-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <button className="text-spotify-text-secondary hover:text-spotify-content transition-colors duration-200">
            <Bell size={20} />
          </button>
          <button className="flex items-center gap-2 bg-spotify-light-gray px-3 py-2 rounded-full hover:bg-spotify-black transition-colors duration-200">
            <div className="w-6 h-6 bg-spotify-green rounded-full flex items-center justify-center">
              <User size={14} className="text-spotify-black" />
            </div>
            <span className="text-sm font-medium text-spotify-content">User</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNav; 