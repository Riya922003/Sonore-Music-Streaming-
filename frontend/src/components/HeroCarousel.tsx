import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
  description?: string;
}

interface HeroCarouselProps {
  songs: Song[];
  autoSlideInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  onHideAnnouncements?: () => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  songs,
  autoSlideInterval = 3000,
  showDots = true,
  showArrows = true,
  onHideAnnouncements
}) => {
  const [currentSlide, setCurrentSlide] = useState(1); // Start at 1 because of cloned slide
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Create extended slides for infinite loop (clone first slide at end and last slide at beginning)
  const extendedSongs = songs.length > 1 ? [
    songs[songs.length - 1], // Clone of last slide at beginning
    ...songs,
    songs[0] // Clone of first slide at end
  ] : songs;

  // Auto-slide functionality
  useEffect(() => {
    if (!isHovered && songs.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, autoSlideInterval);

      return () => clearInterval(interval);
    }
  }, [isHovered, songs.length, autoSlideInterval]);

  // Handle infinite loop transitions
  useEffect(() => {
    if (songs.length <= 1) return;

    const timeout = setTimeout(() => {
      setIsTransitioning(false);
      
      // Reset position for infinite loop effect
      if (currentSlide >= extendedSongs.length - 1) {
        setCurrentSlide(1); // Jump to real first slide (without transition)
      } else if (currentSlide <= 0) {
        setCurrentSlide(songs.length); // Jump to real last slide (without transition)
      }
    }, 500); // Match transition duration

    return () => clearTimeout(timeout);
  }, [currentSlide, extendedSongs.length, songs.length]);

  const nextSlide = () => {
    if (isTransitioning || songs.length <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning || songs.length <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev - 1);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || songs.length <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide(index + 1); // Add 1 because of cloned slide at beginning
  };

  if (!songs.length) return null;

  return (
    <section 
      className="relative h-64 md:h-80 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-700 rounded-lg overflow-hidden mb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Carousel Container */}
      <div className="relative h-full overflow-hidden">
        <div 
          className={`flex h-full transition-transform duration-500 ease-in-out ${
            (!isTransitioning && (currentSlide <= 0 || currentSlide >= extendedSongs.length - 1)) ? 'transition-none' : ''
          }`}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {extendedSongs.map((song, index) => (
            <div key={`${song.id}-${index}`} className="min-w-full h-full relative">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${song.image})` }}
              />
              
              {/* Content */}
              <div className="relative h-full p-4 md:p-8 flex items-center">
                <div className="flex items-center gap-8 max-w-6xl mx-auto w-full">
                  {/* Song Image */}
                  <div className="flex-shrink-0 hidden md:block">
                    <img
                      src={song.image}
                      alt={song.title}
                      className="w-40 h-40 rounded-lg shadow-2xl object-cover"
                    />
                  </div>
                  
                  {/* Song Info */}
                  <div className="flex-1 text-white">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
                      {song.title}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-orange-200 mb-4 drop-shadow">
                      {song.artist}
                    </p>
                    {song.description && (
                      <p className="text-sm md:text-lg text-orange-100 mb-6 drop-shadow max-w-2xl">
                        {song.description}
                      </p>
                    )}
                    
                    {/* Play Button */}
                    <button className="bg-green-500 hover:bg-green-400 text-black px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg">
                      <Play size={20} fill="currentColor" />
                      Play
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && songs.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && songs.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {songs.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-200 disabled:opacity-50 ${
                index === ((currentSlide - 1 + songs.length) % songs.length)
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {((currentSlide - 1 + songs.length) % songs.length) + 1} / {songs.length}
      </div>

      {/* Hide Announcements Button */}
      {onHideAnnouncements && (
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button 
            onClick={onHideAnnouncements}
            className="bg-black/60 hover:bg-black/80 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
          >
            Hide announcements
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
