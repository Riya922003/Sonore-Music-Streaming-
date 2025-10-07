import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Plus } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useUI } from '../contexts/UIContext';
import ElasticSlider from './ElasticSlider';

const MusicPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlayPause, playNext, playPrevious } = usePlayer();
  const { openAddToPlaylistModal } = useUI();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  const demoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Helper function to format seconds into "minutes:seconds" string
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Effect to handle currentSong changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      const audio = audioRef.current;
      console.log('Loading song:', currentSong.title, 'URL:', currentSong.audioUrl);
      console.log('Full currentSong object:', currentSong);
      
      // Try the original URL first
      audio.src = currentSong.audioUrl;
      console.log('Audio element src set to:', audio.src);
      audio.load();
      console.log('Audio load() called, readyState:', audio.readyState, 'networkState:', audio.networkState);
      
      // Reset time states
      setCurrentTime(0);
      setDuration(0);
      
      // Reset fallback state for new song
      setUsingFallback(false);
      
      // Set up error handler for this specific song load
      const handleLoadError = () => {
        console.log('Audio URL failed. Demo mode disabled.');
        // setUsingFallback(true); // DISABLED: Uncomment to enable demo mode
        
        // In demo mode, simulate the audio duration and playback
        // setDuration(currentSong.duration || 180); // DISABLED
        
        // Remove the error event listener to prevent infinite loops
        audio.removeEventListener('error', handleLoadError);
      };
      
      audio.addEventListener('error', handleLoadError, { once: true });
      
      return () => {
        audio.removeEventListener('error', handleLoadError);
      };
    }
  }, [currentSong]);

  // Effect to handle play/pause state changes
  useEffect(() => {
    if (currentSong) {
      console.log('Play state changed:', isPlaying);
      
      if (usingFallback) {
        // Demo mode - simulate playback with timer
        if (isPlaying) {
          demoTimerRef.current = setInterval(() => {
            setCurrentTime(prev => {
              const newTime = prev + 1;
              if (newTime >= duration) {
                if (repeat) {
                  return 0;
                } else {
                  playNext();
                  return 0;
                }
              }
              return newTime;
            });
          }, 1000);
        } else {
          if (demoTimerRef.current) {
            clearInterval(demoTimerRef.current);
            demoTimerRef.current = null;
          }
        }
      } else if (audioRef.current) {
        // Normal audio mode
        if (isPlaying) {
          console.log('Attempting to play audio, readyState:', audioRef.current.readyState);
          audioRef.current.play().then(() => {
            console.log('Audio play() succeeded');
          }).catch((error) => {
            console.error('Error playing audio:', error);
            console.error('Audio ready state:', audioRef.current?.readyState);
            console.error('Audio network state:', audioRef.current?.networkState);
            console.error('Audio src:', audioRef.current?.src);
            // If play fails, don't toggle immediately - let the error handler deal with it
          });
        } else {
          audioRef.current.pause();
          console.log('Audio paused');
        }
      }
    }
    
    // Cleanup timer on unmount or when dependencies change
    return () => {
      if (demoTimerRef.current) {
        clearInterval(demoTimerRef.current);
        demoTimerRef.current = null;
      }
    };
  }, [isPlaying, currentSong, usingFallback, duration, repeat, playNext]);

  // Effect to handle repeat state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = repeat;
    }
  }, [repeat]);

  // Effect to initialize audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle audio metadata loaded (to get duration)
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      console.log('Audio metadata loaded, duration:', audioRef.current.duration);
      setDuration(audioRef.current.duration);
    }
  };

  // Handle audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle seek bar change
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (!usingFallback && audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    // In demo mode, just update the currentTime state
  };

  // Handle volume change from ElasticSlider
  const handleVolumeChange = (sliderValue: number) => {
    const newVolume = sliderValue / 100; // Convert from 0-100 to 0-1
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle add to playlist
  const handleAddToPlaylist = () => {
    if (currentSong) {
      openAddToPlaylistModal(currentSong);
    }
  };

  // Don't render if no current song
  if (!currentSong) {
    return null;
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onError={(e) => {
          console.error('Audio error:', e.currentTarget.error);
          console.log('Audio failed to load. Demo mode is disabled.');
          // Demo mode disabled - no fallback behavior
        }}
        onLoadStart={() => {
          console.log('Audio load started');
        }}
        onCanPlay={() => {
          console.log('Audio can play, duration:', audioRef.current?.duration);
        }}
        onCanPlayThrough={() => {
          console.log('Audio can play through completely');
        }}
        onLoadedData={() => {
          console.log('Audio data loaded');
        }}
        onEnded={() => {
          // Reset to beginning when song ends
          setCurrentTime(0);
          // Only play next if repeat is not enabled
          if (!repeat) {
            playNext();
          }
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
                <button
                  onClick={handleAddToPlaylist}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
                  title="Add to playlist"
                >
                  <Plus size={14} />
                </button>
                {usingFallback && (
                  <span className="text-xs bg-yellow-600 text-yellow-100 px-1 rounded">DEMO</span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate mt-1">
                {currentSong.artist}
                {usingFallback && (
                  <span className="ml-2 text-yellow-400">• Demo Mode</span>
                )}
              </p>
            </div>
          </div>

          {/* Center section - Player controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl mx-8">
            {/* Control buttons */}
            <div className="flex items-center gap-4">
              <button 
                onClick={playPrevious}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack size={20} />
              </button>
              
              {/* Main play/pause button */}
              <button 
                onClick={togglePlayPause}
                className="bg-white text-black p-2 rounded-full hover:scale-105 transition-all"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              
              <button 
                onClick={playNext}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward size={20} />
              </button>
              
              <button 
                onClick={() => setRepeat(!repeat)}
                className={`p-1 rounded transition-colors ${
                  repeat 
                    ? 'text-green-500 bg-green-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title={repeat ? 'Repeat: On' : 'Repeat: Off'}
              >
                <Repeat size={20} />
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
                max={duration}
                value={currentTime}
                onChange={handleSeekChange}
                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #1db954 0%, #1db954 ${duration ? (currentTime / duration) * 100 : 0}%, #4b5563 ${duration ? (currentTime / duration) * 100 : 0}%, #4b5563 100%)`
                }}
              />
              <span className="text-xs text-gray-400 min-w-fit">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right section - Volume controls */}
          <div className="flex items-center w-1/3 justify-center">
            <div className="w-56 flex items-center mr-8">
              <ElasticSlider
                maxValue={100}
                defaultValue={volume * 100} // Convert the 0-1 volume state to a 0-100 scale
                onChange={handleVolumeChange} // Pass the handler function
                leftIcon={<VolumeX size={18} className="text-gray-400" />}
                rightIcon={<Volume2 size={18} className="text-gray-400" />}
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