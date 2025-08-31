import Announcements from './Announcements';
import MusicSection from './MusicSection';

interface PlaylistItem {
  id: number;
  title: string;
  image: string;
  songCount: number;
}

interface AlbumItem {
  id: number;
  title: string;
  artist: string;
  image: string;
}

interface SongItem {
  id: number;
  title: string;
  artist: string;
  image: string;
}

const MainContent: React.FC = () => {
  // Sample data - in a real app, this would come from your backend
  const topPlaylists: PlaylistItem[] = [
    {
      id: 1,
      title: "Today's Top Hits",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      songCount: 50
    },
    {
      id: 2,
      title: "RapCaviar",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop",
      songCount: 35
    },
    {
      id: 3,
      title: "All Out 2010s",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
      songCount: 100
    },
    {
      id: 4,
      title: "Rock Classics",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      songCount: 75
    },
    {
      id: 5,
      title: "Chill Hits",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop",
      songCount: 60
    }
  ];

  const newReleases: AlbumItem[] = [
    {
      id: 1,
      title: "Midnights",
      artist: "Taylor Swift",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Un Verano Sin Ti",
      artist: "Bad Bunny",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      title: "SOS",
      artist: "SZA",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      title: "The Highlights",
      artist: "The Weeknd",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Planet Her",
      artist: "Doja Cat",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop"
    }
  ];

  const recentlyPlayed: SongItem[] = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      title: "As It Was",
      artist: "Harry Styles",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      title: "About Damn Time",
      artist: "Lizzo",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Late Night Talking",
      artist: "Harry Styles",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Hold Me Closer",
      artist: "Elton John & Britney Spears",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop"
    }
  ];

  const bigHits: SongItem[] = [
    {
      id: 1,
      title: "Flowers",
      artist: "Miley Cyrus",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Vampire",
      artist: "Olivia Rodrigo",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Kill Bill",
      artist: "SZA",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Shirt",
      artist: "SZA",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Break My Soul",
      artist: "Beyoncé",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop"
    }
  ];

  const indiasBest: PlaylistItem[] = [
    {
      id: 1,
      title: "Punjabi Hits",
      songCount: 25,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Bollywood Classics",
      songCount: 40,
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Indie India",
      songCount: 30,
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Devotional Songs",
      songCount: 20,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Folk Fusion",
      songCount: 35,
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop"
    }
  ];

  return (
    <div className="ml-64 p-8 min-h-screen bg-spotify-content text-spotify-black">
      <Announcements />
      
      <MusicSection 
        title="Top Playlists" 
        items={topPlaylists} 
        type="playlist" 
      />
      
      <MusicSection 
        title="New Releases" 
        items={newReleases} 
        type="album" 
      />
      
      <MusicSection 
        title="Recently Played" 
        items={recentlyPlayed} 
        type="song" 
      />
      
      <MusicSection 
        title="Big Hits" 
        items={bigHits} 
        type="song" 
      />
      
      <MusicSection 
        title="India's Best" 
        items={indiasBest} 
        type="playlist" 
      />
    </div>
  );
};

export default MainContent;
