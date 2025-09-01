// Example of how to use the updated MainContent with custom data

import MainContent from './components/MainContent';

// Custom playlist data example
const customPlaylistData = [
  {
    id: 1,
    title: "Chill Vibes",
    artist: "Playlist • 50 songs",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=150&h=150&fit=crop"
  },
  {
    id: 2,
    title: "Workout Mix",
    artist: "Playlist • 30 songs",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop"
  },
  {
    id: 3,
    title: "Focus Flow",
    artist: "Playlist • 25 songs",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"
  },
  {
    id: 4,
    title: "Night Drive",
    artist: "Playlist • 40 songs",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&h=150&fit=crop"
  },
  {
    id: 5,
    title: "Summer Hits",
    artist: "Playlist • 60 songs",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&h=150&fit=crop"
  }
];

// Example usage in your app
function ExampleApp() {
  const handleHideAnnouncements = () => {
    console.log('User requested to hide announcements');
    // Add your logic here (e.g., update user preferences)
  };

  return (
    <div className="app">
      <MainContent 
        showAnnouncements={true}
        madeForYouItems={customPlaylistData}
        onHideAnnouncements={handleHideAnnouncements}
      />
    </div>
  );
}

export default ExampleApp;
