import MusicSection from './MusicSection';

const MainContent: React.FC = () => {

  return (
    <div className="space-y-8"> {/* Increased space between sections for better visuals */}
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