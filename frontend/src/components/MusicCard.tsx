import { Play } from 'lucide-react';

interface MusicCardProps {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  onPlay?: () => void;
  className?: string;
  showPlayButton?: boolean;
}

const MusicCard: React.FC<MusicCardProps> = ({
  title,
  subtitle,
  image,
  size = 'medium',
  onClick,
  onPlay,
  className = '',
  showPlayButton = true
}) => {
  const sizeClasses = {
    small: {
      container: 'w-32',
      image: 'h-28',
      title: 'text-xs',
      subtitle: 'text-xs',
      playButton: 'p-2',
      playIcon: 12
    },
    medium: {
      container: 'w-36',
      image: 'h-32',
      title: 'text-sm',
      subtitle: 'text-xs',
      playButton: 'p-2',
      playIcon: 12
    },
    large: {
      container: 'w-48',
      image: 'h-48',
      title: 'text-sm',
      subtitle: 'text-xs',
      playButton: 'p-3',
      playIcon: 16
    }
  };

  const classes = sizeClasses[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <div
      className={`bg-black/30 backdrop-blur-sm p-3 rounded-lg hover:bg-black/50 transition-all duration-300 group cursor-pointer flex-shrink-0 card-hover-scale ${classes.container} ${className}`}
      onClick={handleClick}
    >
      <div className="relative mb-3">
        <img
          src={image}
          alt={title}
          className={`w-full ${classes.image} object-cover rounded-lg transition-transform duration-300`}
          loading="lazy"
        />
        {showPlayButton && (
          <button 
            className={`absolute bottom-2 right-2 bg-green-500 text-black ${classes.playButton} rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200 shadow-lg`}
            onClick={handlePlayClick}
            aria-label={`Play ${title}`}
          >
            <Play size={classes.playIcon} fill="currentColor" />
          </button>
        )}
      </div>
      <h3 className={`text-white font-semibold mb-1 truncate ${classes.title}`} title={title}>
        {title}
      </h3>
      <p className={`text-orange-200 truncate ${classes.subtitle}`} title={subtitle}>
        {subtitle}
      </p>
    </div>
  );
};

export default MusicCard;
