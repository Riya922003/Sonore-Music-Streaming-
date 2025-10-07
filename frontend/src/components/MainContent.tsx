import MusicSection from './MusicSection';

const MainContent: React.FC = () => {

  return (
    <div className="space-y-8"> {/* Increased space between sections for better visuals */}
      <MusicSection 
        title="Featured" 
        fetchUrl="/songs/featured" 
      />
      <MusicSection 
        title="Latest Punjabi" 
        fetchUrl="/songs?language=Punjabi" 
      />
      <MusicSection 
        title="Top English" 
        fetchUrl="/songs?language=English" 
      />
      <MusicSection 
        title="Bollywood Hits" 
        fetchUrl="/songs?genre=Bollywood" 
      />
    </div>
  );
};

export default MainContent;