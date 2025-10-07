import React, { useState } from 'react';
import { X, Loader2, Clock } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
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
      const response = await apiClient.get<QueueResponse>(`/api/songs/queue/generate?duration=${duration}`);
      
      if (response.data.success && response.data.queue.length > 0) {
        // Transform songs to match the expected format for the player
        const transformedQueue = response.data.queue.map(song => ({
          ...song,
          audioUrl: song.url || song.audioUrl,
          albumArt: song.thumbnail || song.albumArt,
        }));

        // Play the first song with the entire queue
        playSong(transformedQueue[0], transformedQueue);
        
        // Close the modal
        onClose();
      } else {
        setError('No songs found for the requested duration. Please try again.');
      }
    } catch (error: any) {
      console.error('Error generating focus queue:', error);
      setError(
        error.response?.data?.message || 
        'Failed to generate focus queue. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock size={20} />
            Create a Focus Queue
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
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
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              placeholder="Enter duration in minutes"
            />
            <p className="text-xs text-gray-400 mt-1">
              Generate a random queue for your focus session
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
};

export default FocusQueueModal;