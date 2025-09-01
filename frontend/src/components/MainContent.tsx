import { useState } from 'react';
import { Play, ChevronRight } from 'lucide-react';
import MusicCard from './MusicCard';

interface MadeForYouItem {
  id: number;
  title: string;
  artist: string;
  image: string;
}

interface MainContentProps {
  showAnnouncements?: boolean;
  madeForYouItems?: MadeForYouItem[];
  onHideAnnouncements?: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  showAnnouncements = true,
  madeForYouItems,
  onHideAnnouncements 
}) => {
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  // Default "Made For You" data matching the image
  const defaultMadeForYou: MadeForYouItem[] = madeForYouItems || [
    {
      id: 1,
      title: "Jism",
      artist: "Playlist",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"
    },
    {
      id: 2,
      title: "Best Bhajans",
      artist: "Playlist",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&h=150&fit=crop"
    },
    {
      id: 3,
      title: "Pal Pal by Afsuk, Talwinder",
      artist: "Single",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150&h=150&fit=crop"
    },
    {
      id: 4,
      title: "Liked Songs",
      artist: "Playlist",
      image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&h=150&fit=crop"
    },
    {
      id: 5,
      title: "Apni Thakurani",
      artist: "Single",
      image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=150&h=150&fit=crop"
    },
    {
      id: 6,
      title: "This Is Yo Yo Honey Singh",
      artist: "Playlist",
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=150&h=150&fit=crop"
    },
    {
      id: 7,
      title: "Bollywood Dance Music",
      artist: "Playlist",
      image: "https://images.unsplash.com/photo-1548502632-6b93092aad0b?w=150&h=150&fit=crop"
    },
    {
      id: 8,
      title: "Talwinder",
      artist: "Artist",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=150&fit=crop"
    }
  ];

  const playlistFilters = [
    { id: 'all', label: 'All', active: true },
    { id: 'music', label: 'Music', active: false },
    { id: 'podcasts', label: 'Podcasts', active: false }
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section with Brown/Orange Gradient and Hover Card Carousel */}
      {showAnnouncements && (
        <section 
          className="relative h-80 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-700 rounded-lg overflow-hidden mb-8 transition-all duration-300"
          onMouseEnter={() => setIsHeroHovered(true)}
          onMouseLeave={() => setIsHeroHovered(false)}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full p-6 flex flex-col justify-center">
            {/* Hide Announcements Button - Always centered and visible on hover */}
            <div className={`flex items-center justify-center mb-6 transition-all duration-300 ${
              isHeroHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <button 
                onClick={onHideAnnouncements}
                className="bg-black/60 hover:bg-black/80 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                Hide announcements
              </button>
            </div>

            {/* Made For You Cards - Show on Hover */}
            <div className={`transition-all duration-500 ease-in-out ${
              isHeroHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Made For You</h2>
                <button className="text-orange-200 hover:text-white text-sm font-medium flex items-center gap-1 hover:underline transition-all duration-200">
                  Show all
                  <ChevronRight size={16} />
                </button>
              </div>
              
              {/* Horizontal Scrollable Cards */}
              <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-4 hero-cards" style={{ minWidth: 'max-content' }}>
                  {defaultMadeForYou.slice(0, 6).map((item) => (
                    <MusicCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      subtitle={item.artist}
                      image={item.image}
                      size="small"
                      onClick={() => console.log(`Clicked ${item.title}`)}
                      onPlay={() => console.log(`Playing ${item.title}`)}
                      className="hero-card"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter Pills */}
      <section className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {playlistFilters.map((filter) => (
            <button
              key={filter.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter.active
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Playlists Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Featured Playlists</h2>
          <button className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1 hover:underline transition-all duration-200">
            Show all
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Scrollable Cards Container */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
            {defaultMadeForYou.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900/50 p-4 rounded-lg hover:bg-gray-800/70 transition-all duration-300 group cursor-pointer flex-shrink-0 w-48 hover:scale-105"
              >
                <div className="relative mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300"
                  />
                  <button className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200 shadow-lg">
                    <Play size={16} fill="currentColor" />
                  </button>
                </div>
                <h3 className="text-white font-semibold mb-2 truncate text-sm">{item.title}</h3>
                <p className="text-gray-400 text-xs truncate">{item.artist}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Played Section */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recently Played</h2>
          <button className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1 hover:underline transition-all duration-200">
            Show all
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Responsive Grid - Mobile: 2 cols, Tablet: 3-4 cols, Desktop: 6-8 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {defaultMadeForYou.slice(0, 8).map((item) => (
            <div
              key={`recent-${item.id}`}
              className="bg-gray-900/50 p-3 rounded-lg hover:bg-gray-800/70 transition-all duration-300 group cursor-pointer hover:scale-105"
            >
              <div className="relative mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-32 object-cover rounded-md transition-transform duration-300"
                />
                <button className="absolute bottom-1 right-1 bg-green-500 text-black p-2 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200">
                  <Play size={12} fill="currentColor" />
                </button>
              </div>
              <h3 className="text-white font-semibold mb-1 truncate text-xs">{item.title}</h3>
              <p className="text-gray-400 text-xs truncate">{item.artist}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainContent;
