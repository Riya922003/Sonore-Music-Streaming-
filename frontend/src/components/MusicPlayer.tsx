import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Maximize,
  Settings,
  List,
  Heart,
  Mic,
  BarChart3,
  Zap,
  Cast
} from 'lucide-react';
import { useState } from 'react';

interface Song {
  title: string;
  artist: string;
  image: string;
  duration: number; // in seconds
}

interface MusicPlayerProps {
  song?: Song;
  initialTime?: number;
  initialVolume?: number;
  initialPlayingState?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  song,
  initialTime = 203, // 3:23 in seconds to match image
  initialVolume = 85,
  initialPlayingState = true
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(initialPlayingState);
  const [currentTime, setCurrentTime] = useState<number>(initialTime);
  const [volume, setVolume] = useState<number>(initialVolume);

  const currentSong: Song = song || {
    title: "Do Pal",
    artist: "Coachsahb, Asa Singh Mastana, Surinder Kaur",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop",
    duration: 329 // 5:29 in seconds to match image
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTime = (parseInt(e.target.value) / 100) * currentSong.duration;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setVolume(parseInt(e.target.value));
  };

  const progressPercentage = (currentTime / currentSong.duration) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-6 py-3 z-20">
      <style>
        {`
          .music-progress-slider {
            background: linear-gradient(to right, #ffffff 0%, #ffffff ${progressPercentage}%, #555555 ${progressPercentage}%, #555555 100%);
          }
          .music-progress-slider::-webkit-slider-thumb {
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
          }
          .music-progress-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
          }
          .volume-slider {
            background: linear-gradient(to right, #ffffff 0%, #ffffff ${volume}%, #555555 ${volume}%, #555555 100%);
          }
          .volume-slider::-webkit-slider-thumb {
            appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: none;
          }
          .volume-slider::-moz-range-thumb {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: none;
          }
          .control-button {
            transition: all 0.2s ease;
          }
          .control-button:hover {
            transform: scale(1.05);
            color: #ffffff;
          }
        `}
      </style>
      
      <div className="flex items-center justify-between max-w-full mx-auto">
        {/* Left Section - Song Info with heart icon positioned close to title */}
        <div className="flex items-center gap-4 w-1/3 min-w-0 pr-8">
          <img
            src={currentSong.image}
            alt={currentSong.title}
            className="w-14 h-14 rounded object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white truncate">{currentSong.title}</h4>
              <button className="text-gray-400 hover:text-white control-button flex-shrink-0">
                <Heart size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 truncate mt-1">{currentSong.artist}</p>
          </div>
        </div>

        {/* Center Section - Playback Controls with better spacing */}
        <div className="flex flex-col items-center w-1/3 max-w-2xl px-8">
          <div className="flex items-center gap-6 mb-4">
            <button className="text-gray-300 hover:text-white control-button">
              <SkipBack size={22} fill="currentColor" />
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-white text-black p-3 rounded-full hover:scale-110 transition-all duration-200 shadow-lg"
            >
              {isPlaying ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" />}
            </button>
            <button className="text-gray-300 hover:text-white control-button">
              <SkipForward size={22} fill="currentColor" />
            </button>
          </div>
          
          {/* Progress Bar with time indicators */}
          <div className="flex items-center gap-3 w-full max-w-lg">
            <span className="text-xs text-gray-300 w-12 text-right font-medium">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={handleProgressChange}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer music-progress-slider"
              />
            </div>
            <span className="text-xs text-gray-300 w-12 font-medium">
              {formatTime(currentSong.duration)}
            </span>
          </div>
        </div>

        {/* Right Section - Extended Controls like in the image */}
        <div className="flex items-center gap-4 w-1/3 justify-end pl-8">
          <button className="text-gray-400 hover:text-white control-button">
            <List size={18} />
          </button>
          <button className="text-gray-400 hover:text-white control-button">
            <Zap size={18} />
          </button>
          <button className="text-gray-400 hover:text-white control-button">
            <Cast size={18} />
          </button>
          <button className="text-gray-400 hover:text-white control-button">
            <Mic size={18} />
          </button>
          <button className="text-gray-400 hover:text-white control-button">
            <BarChart3 size={18} />
          </button>
          
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-white control-button">
              <Volume2 size={18} />
            </button>
            <div className="w-24 relative">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer volume-slider"
              />
            </div>
          </div>
          
          <button className="text-gray-400 hover:text-white control-button">
            <Settings size={18} />
          </button>
          <button className="text-gray-400 hover:text-white control-button">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
