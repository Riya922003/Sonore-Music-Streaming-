import MusicSection from './MusicSection';
import { useAuth } from '../contexts/AuthContext';

const MainContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8"> {/* Increased space between sections for better visuals */}
      {user && (
        <MusicSection 
          title="Recently Played" 
          fetchUrl="/api/me/history" 
        />
      )}
      <MusicSection 
        title="Featured" 
        fetchUrl="/api/songs/featured" 
      />
      <MusicSection 
        title="Latest Punjabi" 
        fetchUrl="/api/songs?language=punjabi" 
      />
      <MusicSection 
        title="Top English" 
        fetchUrl="/api/songs?language=english" 
      />
      <MusicSection 
        title="Bollywood Hits" 
        fetchUrl="/api/songs?genre=Bollywood" 
      />
    </div>
  );
};

export default MainContent;