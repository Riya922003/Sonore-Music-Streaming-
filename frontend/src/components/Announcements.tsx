import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  color: string;
}

const Announcements: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const announcements: Announcement[] = [
    {
      id: 1,
      title: "New Album Release",
      subtitle: "Check out the latest hits from top artists",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
      color: "from-purple-600 to-pink-600"
    },
    {
      id: 2,
      title: "Summer Playlist",
      subtitle: "The perfect soundtrack for your summer vibes",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=400&fit=crop",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 3,
      title: "Exclusive Content",
      subtitle: "Listen to unreleased tracks and live performances",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=400&fit=crop",
      color: "from-blue-600 to-cyan-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [announcements.length]);

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % announcements.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  return (
    <section className="mb-12">
      <h2 className="section-title">Featured</h2>
      
      <div className="relative h-80 rounded-xl overflow-hidden">
        {/* Slides */}
        <div className="relative h-full">
          {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative h-full">
                <img
                  src={announcement.image}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
                <div className="gradient-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-lg text-gray-200 mb-4">
                    {announcement.subtitle}
                  </p>
                  <button className="bg-spotify-green text-black px-6 py-3 rounded-full font-semibold hover:bg-green-400 transition-colors duration-200 flex items-center gap-2">
                    <Play size={20} />
                    Listen Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentSlide ? 'bg-spotify-green' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Announcements;
