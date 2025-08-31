import { Play, Heart, MoreHorizontal } from 'lucide-react';

const MusicSection = ({ title, items, type = 'playlist' }) => {
  return (
    <section className="mb-12">
      <h2 className="section-title">{title}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((item) => (
          <div key={item.id} className="music-card">
            <div className="relative mb-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-full aspect-square object-cover rounded-md"
              />
              <button className="play-button">
                <Play size={20} />
              </button>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-spotify-black text-sm truncate">
                {item.title}
              </h3>
              <p className="text-spotify-text-secondary text-xs truncate">
                {type === 'playlist' ? `${item.songCount} songs` : item.artist}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <button className="text-spotify-text-secondary hover:text-spotify-green transition-colors duration-200">
                <Heart size={16} />
              </button>
              <button className="text-spotify-text-secondary hover:text-spotify-black transition-colors duration-200">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MusicSection; 