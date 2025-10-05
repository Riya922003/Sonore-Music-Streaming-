import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

const MusicPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlayPause } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(50);

  // Effect to handle currentSong changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      // Set the audio source to the current song's URL
      audioRef.current.src = currentSong.audioUrl;
      
      // Play the audio
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }, [currentSong]);

  // Effect to handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle audio metadata loaded (to get duration)
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle seek bar change
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  // Format time in MM:SS format
  // Don't render if no current song
  if (!currentSong) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          // Reset to beginning when song ends
          setCurrentTime(0);
        }}
      />
      
      {/* Music Player UI */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-3 z-30">
        <div className="flex items-center justify-between max-w-full">
          {/* Left section - Song info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={currentSong.albumArt || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop'}
              alt={currentSong.title}
              className="w-14 h-14 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white truncate">{currentSong.title}</h4>
              </div>
              <p className="text-xs text-gray-400 truncate mt-1">{currentSong.artist}</p>
            </div>
          </div>

          {/* Center section - Player controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl mx-8">
            {/* Control buttons */}
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <SkipBack size={20} />
              </button>
              
              {/* Main play/pause button */}
              <button 
                onClick={togglePlayPause}
                className="bg-white text-black p-2 rounded-full hover:scale-105 transition-all"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              
              <button className="text-gray-400 hover:text-white transition-colors">
                <SkipForward size={20} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-400 min-w-fit">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #1db954 0%, #1db954 ${(currentTime / (duration || 100)) * 100}%, #4b5563 ${(currentTime / (duration || 100)) * 100}%, #4b5563 100%)`
                }}
              />
              <span className="text-xs text-gray-400 min-w-fit">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right section - Volume controls */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="flex items-center gap-2">
              <Volume2 size={20} className="text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #1db954;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #1db954;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider:hover::-webkit-slider-thumb {
          transform: scale(1.2);
        }
        
        .slider:hover::-moz-range-thumb {
          transform: scale(1.2);
        }
      `}</style>
    </>
  );
};

export default MusicPlayer;
