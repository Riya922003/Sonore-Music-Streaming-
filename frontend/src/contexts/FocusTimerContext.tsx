import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FocusTimerContextType {
  isTimerActive: boolean;
  timeRemaining: number; // in seconds
  totalDuration: number; // in seconds
  startTimer: (durationMinutes: number) => void;
  stopTimer: () => void;
  formatTime: (seconds: number) => string;
}

const FocusTimerContext = createContext<FocusTimerContextType | undefined>(undefined);

interface FocusTimerProviderProps {
  children: ReactNode;
}

export const FocusTimerProvider: React.FC<FocusTimerProviderProps> = ({ children }) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startTimer = (durationMinutes: number) => {
    const durationSeconds = durationMinutes * 60;
    setTotalDuration(durationSeconds);
    setTimeRemaining(durationSeconds);
    setIsTimerActive(true);
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    setTimeRemaining(0);
    setTotalDuration(0);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Timer countdown effect
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      const id = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setIntervalId(id);
      
      return () => {
        if (id) clearInterval(id);
      };
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [isTimerActive, timeRemaining, intervalId]);

  // Auto-stop timer when it reaches 0
  useEffect(() => {
    if (isTimerActive && timeRemaining === 0) {
      setIsTimerActive(false);
      // You could add a notification here when the timer completes
      console.log('Focus session completed!');
    }
  }, [timeRemaining, isTimerActive]);

  const value: FocusTimerContextType = {
    isTimerActive,
    timeRemaining,
    totalDuration,
    startTimer,
    stopTimer,
    formatTime,
  };

  return (
    <FocusTimerContext.Provider value={value}>
      {children}
    </FocusTimerContext.Provider>
  );
};

export const useFocusTimer = (): FocusTimerContextType => {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error('useFocusTimer must be used within a FocusTimerProvider');
  }
  return context;
};