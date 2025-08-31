import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Shuffle, 
  Repeat,
  Heart,
  List
} from 'lucide-react';
import { useState } from 'react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [volume, setVolume] = useState(80);

  const currentSong = {
    title: "Blinding Lights",
    artist: "The Weeknd",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop"
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-spotify-light-gray px-6 py-4 z-20">
      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center gap-4 w-1/4">
          <img
            src={currentSong.image}
            alt={currentSong.title}
            className="w-14 h-14 rounded object-cover"
          />
          <div>
            <h4 className="text-sm font-medium text-spotify-content">{currentSong.title}</h4>
            <p className="text-xs text-spotify-text-secondary">{currentSong.artist}</p>
          </div>
          <button className="text-spotify-text-secondary hover:text-spotify-green transition-colors duration-200">
            <Heart size={16} />
          </button>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-6 mb-2">
            <button className="text-spotify-text-secondary hover:text-spotify-content transition-colors duration-200">
              <Shuffle size={20} />
            </button>
            <button className="text-spotify-text-secondary hover:text-spotify-content transition-colors duration-200">
              <SkipBack size={20} />
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-spotify-content text-spotify-black p-3 rounded-full hover:scale-110 transition-transform duration-200"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className="text-spotify-text-secondary hover:text-spotify-content transition-colors duration-200">
              <SkipForward size={20} />
            </button>
            <button className="text-spotify-text-secondary hover:text-spotify-content transition-colors duration-200">
              <Repeat size={20} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs text-spotify-text-secondary w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={(currentTime / duration) * 100}
                onChange={handleProgressChange}
                className="w-full h-1 bg-spotify-light-gray rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${(currentTime / duration) * 100}%, #535353 ${(currentTime / duration) * 100}%, #535353 100%)`
                }}
              />
            </div>
            <span className="text-xs text-spotify-text-secondary w-12">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume and Queue Controls */}
        <div className="flex items-center gap-4 w-1/4 justify-end">
          <button className="text-spotify-text-secondary hover:text-spotify-content transition-colors duration-200">
            <List size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-spotify-text-secondary" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-spotify-light-gray rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume}%, #535353 ${volume}%, #535353 100%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 