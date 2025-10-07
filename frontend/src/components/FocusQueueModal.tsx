import React, { useState } from 'react';
import { X, Loader2, Clock } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useFocusTimer } from '../contexts/FocusTimerContext';
import StarBorder from './StarBorder';
import apiClient from '../api';

interface FocusQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QueueResponse {
  success: boolean;
  requestedDurationMinutes: number;
  requestedDurationSeconds: number;
  actualDurationSeconds: number;
  actualDurationMinutes: number;
  count: number;
  queue: any[];
}

const FocusQueueModal: React.FC<FocusQueueModalProps> = ({ isOpen, onClose }) => {
  const { playSong } = usePlayer();
  const { isTimerActive, timeRemaining, formatTime, startTimer, stopTimer } = useFocusTimer();
  const [duration, setDuration] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (duration <= 0) {
      setError('Duration must be greater than 0 minutes');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log(`Making request to: /api/songs/queue/generate?duration=${duration}`);
      const response = await apiClient.get<QueueResponse>(`/api/songs/queue/generate?duration=${duration}`);
      
      console.log('Queue response:', response.data);
      
      if (response.data.success && response.data.queue.length > 0) {
        // Transform songs to match the expected format for the player
        const transformedQueue = response.data.queue.map(song => ({
          ...song,
          audioUrl: song.url || song.audioUrl,
          albumArt: song.thumbnail || song.albumArt,
        }));

        console.log('Transformed queue:', transformedQueue);

        // Start the focus timer
        startTimer(duration);

        // Play the first song with the entire queue
        playSong(transformedQueue[0], transformedQueue);
        
        // Close the modal
        onClose();
      } else {
        setError('No songs found for the requested duration. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error generating focus queue:', error);
      
      const axiosError = error as { response?: { status: number; data?: { message?: string } }; code?: string };
      console.error('Error response:', axiosError.response);
      
      if (axiosError.response?.status === 400) {
        setError(axiosError.response.data?.message || 'Invalid duration provided.');
      } else if (axiosError.response?.status === 500) {
        setError('Server error occurred. Please try again later.');
      } else if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(
          axiosError.response?.data?.message || 
          'Failed to generate focus queue. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTimer = () => {
    stopTimer();
    onClose();
  };

  const handleClose = () => {
    if (!isLoading) {
      setError('');
      setDuration(30);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock size={20} />
            Create a Focus Queue
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-900/20 border border-red-700/30 rounded-md">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Content */}
        {isTimerActive ? (
          /* Timer Active View */
          <div className="p-4">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-900/30 border border-green-700/50 rounded-full flex items-center justify-center">
                  <Clock size={24} className="text-green-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Focus Session Active</h3>
              <div className="text-3xl font-mono text-green-400 mb-2">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-gray-400 text-sm">remaining in your focus session</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${((timeRemaining / (duration * 60)) * 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Started</span>
                <span>{Math.round(((timeRemaining / (duration * 60)) * 100))}% remaining</span>
              </div>
            </div>

            {/* Cancel Button */}
            <StarBorder
              as="button"
              onClick={handleCancelTimer}
              className="w-full"
              color="#f97316"
              speed="4s"
              thickness={2}
            >
              End Focus Session
            </StarBorder>
          </div>
        ) : (
          /* New Session Form */
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
                max="300"
                disabled={isLoading}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:opacity-50"
                placeholder="Enter duration in minutes"
              />
              <p className="text-xs text-gray-400 mt-1">
                Generate a random queue for your focus session
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || duration <= 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Start Focus Session'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FocusQueueModal;