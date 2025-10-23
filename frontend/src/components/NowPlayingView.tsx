import React, { useEffect, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useUI } from '../contexts/UIContext';
import apiClient from '../api';

const NowPlayingView: React.FC = () => {
  const { currentSong } = usePlayer();
  const { closeNowPlayingPanel, insightRequestCounter } = useUI();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [insightText, setInsightText] = useState<string>('');

  useEffect(() => {
    if (!currentSong) {
      setInsightText('');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchInsight = async () => {
      setIsLoading(true);
      setInsightText('');
      try {
        const response = await apiClient.get(`/api/songs/${currentSong._id}/insights`);
        const data = response && response.data ? response.data : null;
        if (!cancelled) {
          const text = data?.insight ?? data?.message ?? 'No insight available.';
          setInsightText(text);
        }
      } catch (err: unknown) {
        // Log the error for debugging and show fallback text
        console.error('Failed to fetch insight', err);
        if (!cancelled) {
          // Try to show server-provided message if available
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const serverMessage = (err as any)?.response?.data?.message;
          setInsightText(serverMessage ?? 'No insight available.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchInsight();

    // cleanup
    return () => {
      cancelled = true;
    };
  }, [currentSong, insightRequestCounter]);

  if (!currentSong) return null;

  return (
    <div className="fixed top-0 right-0 m-2 h-[calc(100vh-1rem)] w-96 z-10 bg-gray-900 text-white shadow-lg rounded-lg">
      {/* Inner scrollable wrapper with padding */}
      <div className="h-full overflow-y-auto scrollbar-hide py-6 px-4">
        <div className="flex justify-end">
          <button
            aria-label="Close now playing panel"
            onClick={() => closeNowPlayingPanel()}
            className="text-gray-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <div className="w-full h-48 bg-gray-800 flex items-center justify-center mb-4">
            {currentSong.albumArt ? (
              // large thumbnail
              <img src={currentSong.albumArt} alt={`${currentSong.title} artwork`} className="object-cover w-full h-full" />
            ) : (
              <div className="text-gray-400">No artwork</div>
            )}
          </div>

          <h4 className="text-xl font-semibold">{currentSong.title}</h4>
          <p className="text-sm text-gray-300 mb-4">{currentSong.artist}</p>

          <div className="text-sm text-gray-200">
            {isLoading ? (
              <div className="italic">Generating insight...</div>
            ) : (
              <div className="whitespace-pre-line">{insightText || 'No insight available.'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingView;
