import React from 'react';
import YouTube from 'react-youtube';
import { usePlayer } from '../contexts/PlayerContext';

interface VideoModalProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoId, isOpen, onClose }) => {
  const { isPlaying, togglePlayPause } = usePlayer();

  // YouTube player options
  const opts = {
    height: '480',
    width: '854',
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
    },
  };

  // Handle background click to close modal
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key press and pause music when modal opens
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Pause the music when video modal opens to avoid double audio
      if (isPlaying) {
        togglePlayPause();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isPlaying, togglePlayPause]);

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="relative bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
          aria-label="Close video modal"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        {/* Video container */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {videoId ? (
              <YouTube
                videoId={videoId}
                opts={opts}
                className="w-full h-full"
                iframeClassName="w-full h-full"
                onError={(error) => {
                  console.error('YouTube player error:', error);
                }}
              />
            ) : (
              <div className="text-gray-400 text-center p-8">
                <p className="text-lg mb-2 text-white">No video available</p>
                <p className="text-sm">Unable to load video for this song</p>
              </div>
            )}
          </div>
        </div>

        {/* Optional: Video info section */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            Press <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Esc</kbd> or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;