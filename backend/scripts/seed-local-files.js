require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/Song');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Song metadata database with specific data for each song
const songMetadata = {
  // English songs
  'bring-me-back-283196': {
    artist: 'Echo Valley',
    duration: 183,
    genre: 'Pop',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  'celtic-irish-scottish-tin-whistle-background-music-10455': {
    artist: 'Celtic Winds',
    duration: 245,
    genre: 'Folk',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
  },
  'english-poem-108554': {
    artist: 'Spoken Dreams',
    duration: 108,
    genre: 'Spoken Word',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop'
  },
  'hark-the-herald-angels-sing-traditional-english-christmas-carol-178364': {
    artist: 'Christmas Choir',
    duration: 178,
    genre: 'Christmas',
    thumbnail: 'https://images.unsplash.com/photo-1544273677-6e4141727927?w=800&h=600&fit=crop'
  },
  'how-far-is-it-to-bethlehem-traditional-english-christmas-carol-178351': {
    artist: 'Holiday Harmonies',
    duration: 165,
    genre: 'Christmas',
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop'
  },
  'i-want-to-dissolve-in-this-rain-405188': {
    artist: 'Rainy Day Dreams',
    duration: 225,
    genre: 'Ambient',
    thumbnail: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&h=600&fit=crop'
  },
  'noctilucent-circuit-406493': {
    artist: 'Electric Nights',
    duration: 267,
    genre: 'Electronic',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=600&fit=crop'
  },
  'song-english-edm-296526': {
    artist: 'Pulse Makers',
    duration: 196,
    genre: 'EDM',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  'sun-beneath-a-song-410790': {
    artist: 'Golden Hour',
    duration: 243,
    genre: 'Indie',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
  },
  'the-adventures-of-mr-hardy_30sec-175535': {
    artist: 'Adventure Tales',
    duration: 30,
    genre: 'Soundtrack',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop'
  },
  'the-adventures-of-mr-hardy_60sec-175536': {
    artist: 'Adventure Tales',
    duration: 60,
    genre: 'Soundtrack',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop'
  },
  'the-black-oath-of-white-fire-399835': {
    artist: 'Dark Symphony',
    duration: 289,
    genre: 'Cinematic',
    thumbnail: 'https://images.unsplash.com/photo-1574097656146-0b43b7660cb6?w=800&h=600&fit=crop'
  },
  'the-last-phantom-rose-alive-409395': {
    artist: 'Phantom Rose',
    duration: 312,
    genre: 'Gothic Rock',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
  },
  'the-old-mask-of-new-faces-409394': {
    artist: 'Masked Identity',
    duration: 278,
    genre: 'Alternative',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
  },
  'the-shape-of-disorder-410788': {
    artist: 'Chaos Theory',
    duration: 235,
    genre: 'Experimental',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop'
  },
  'the-song-of-alone-410791': {
    artist: 'Solitude',
    duration: 198,
    genre: 'Melancholic',
    thumbnail: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=800&h=600&fit=crop'
  },
  'we-wish-you-a-merry-christmas-english-carol-sheppard-flute-8848': {
    artist: 'Flute Ensemble',
    duration: 145,
    genre: 'Christmas',
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop'
  },
  'what-is-not-for-me-410786': {
    artist: 'Reflection',
    duration: 207,
    genre: 'Indie Pop',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  'where-tomorrow-refuses-to-arrive-400834': {
    artist: 'Time Drift',
    duration: 256,
    genre: 'Progressive',
    thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop'
  },
  'whispers-in-the-broken-horizon-400833': {
    artist: 'Broken Horizon',
    duration: 234,
    genre: 'Atmospheric',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
  },

  // Hindi songs
  'Drama Queen': {
    artist: 'Vishal Dadlani',
    duration: 195,
    genre: 'Bollywood',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  'Lat Lag Gayee': {
    artist: 'Benny Dayal',
    duration: 212,
    genre: 'Bollywood',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
  },
  'Lonely': {
    artist: 'Armaan Malik',
    duration: 178,
    genre: 'Bollywood Pop',
    thumbnail: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=800&h=600&fit=crop'
  },
  'Make Some Noise For The Desi Boyz': {
    artist: 'RDB',
    duration: 223,
    genre: 'Bollywood Dance',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  'mein_agar_kahoon_keys': {
    artist: 'Udit Narayan',
    duration: 267,
    genre: 'Bollywood Romance',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
  },
  'Mungda': {
    artist: 'Jyotica Tangri',
    duration: 189,
    genre: 'Bollywood Item',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
  },
  'Oh Ho Ho Ho (Remix)': {
    artist: 'Sunidhi Chauhan',
    duration: 198,
    genre: 'Bollywood Remix',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  'She Move It Like (1)': {
    artist: 'Badshah',
    duration: 167,
    genre: 'Hip Hop Hindi',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  'She Move It Like': {
    artist: 'Badshah',
    duration: 167,
    genre: 'Hip Hop Hindi',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },

  // Punjabi songs
  'Cheques': {
    artist: 'Shubh',
    duration: 156,
    genre: 'Punjabi Pop',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  'For A Reason (1)': {
    artist: 'Sidhu Moose Wala',
    duration: 203,
    genre: 'Punjabi Hip Hop',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  'For A Reason': {
    artist: 'Sidhu Moose Wala',
    duration: 203,
    genre: 'Punjabi Hip Hop',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  'I Really Do....': {
    artist: 'Karan Aujla',
    duration: 187,
    genre: 'Punjabi Romance',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
  },
  'MF Gabhru!': {
    artist: 'AP Dhillon',
    duration: 145,
    genre: 'Punjabi Trap',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  'Supreme': {
    artist: 'Shubh',
    duration: 172,
    genre: 'Punjabi Pop',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  'Wavy (1)': {
    artist: 'Gurinder Gill',
    duration: 189,
    genre: 'Punjabi Urban',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  'Wavy': {
    artist: 'Gurinder Gill',
    duration: 189,
    genre: 'Punjabi Urban',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  'Winning Speech': {
    artist: 'Karan Aujla',
    duration: 234,
    genre: 'Punjabi Rap',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  }
};

// Placeholder URLs for local MP3 files (these would be actual Cloudinary URLs after upload)
const generatePlaceholderUrl = (filename, language) => {
  return `https://example.com/songs/${language}/${filename}`;
};

const fallbackData = {
  english: {
    artists: ['The Beatles', 'Ed Sheeran', 'Taylor Swift', 'Adele', 'Coldplay', 'Imagine Dragons', 'OneRepublic', 'Maroon 5'],
    genres: ['Pop', 'Rock', 'Alternative', 'Indie', 'Electronic', 'Folk', 'Country', 'R&B'],
    thumbnails: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
    ]
  },
  hindi: {
    artists: ['Arijit Singh', 'Shreya Ghoshal', 'Armaan Malik', 'Sunidhi Chauhan', 'Rahat Fateh Ali Khan', 'Vishal Dadlani', 'Shilpa Rao'],
    genres: ['Bollywood', 'Bollywood Pop', 'Bollywood Romance', 'Bollywood Dance', 'Sufi', 'Ghazal'],
    thumbnails: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
    ]
  },
  punjabi: {
    artists: ['Sidhu Moose Wala', 'Karan Aujla', 'AP Dhillon', 'Shubh', 'Diljit Dosanjh', 'Gurdas Maan', 'Ammy Virk'],
    genres: ['Punjabi Pop', 'Punjabi Hip Hop', 'Bhangra', 'Punjabi Folk', 'Punjabi Trap', 'Punjabi Romance'],
    thumbnails: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
    ]
  }
};

const getSongData = (songName, language) => {
  const cleanName = songName.replace(/\.[^/.]+$/, ''); // Remove extension
  
  if (songMetadata[cleanName]) {
    return songMetadata[cleanName];
  }
  
  // Fallback to random data
  const fallback = fallbackData[language] || fallbackData.english;
  return {
    artist: fallback.artists[Math.floor(Math.random() * fallback.artists.length)],
    duration: Math.floor(Math.random() * 120) + 120, // 120-240 seconds
    genre: fallback.genres[Math.floor(Math.random() * fallback.genres.length)],
    thumbnail: fallback.thumbnails[Math.floor(Math.random() * fallback.thumbnails.length)]
  };
};

const seedSongsFromLocalFiles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected for seeding.');

    // Clear existing songs
    await Song.deleteMany({});
    console.log('🧹 Cleared existing songs.');

    const user = await User.findOne();
    if (!user) {
      console.error('❌ No user found. Please create a user before seeding.');
      mongoose.disconnect();
      return;
    }
    console.log(`📝 Using user "${user.name}" as the uploader.`);

    const SONGS_BASE_DIRECTORY = path.join(__dirname, '..', 'songs-to-upload');
    
    if (!fs.existsSync(SONGS_BASE_DIRECTORY)) {
      console.error(`❌ Error: Directory not found at ${SONGS_BASE_DIRECTORY}`);
      return;
    }

    const languageFolders = fs.readdirSync(SONGS_BASE_DIRECTORY, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`📁 Found ${languageFolders.length} language folders: ${languageFolders.join(', ')}\n`);

    const songsToInsert = [];

    for (const language of languageFolders) {
      console.log(`🔄 Processing folder: ${language.toUpperCase()}...`);
      const languagePath = path.join(SONGS_BASE_DIRECTORY, language);
      const files = fs.readdirSync(languagePath);
      const songFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.m4a'));

      if (songFiles.length === 0) {
        console.log(`⚠️  No songs found in ${language} folder.\n`);
        continue;
      }

      console.log(`📊 Found ${songFiles.length} songs in ${language} folder`);

      for (const songFile of songFiles) {
        const songName = path.basename(songFile, path.extname(songFile));
        const songData = getSongData(songName, language);
        const isFeatured = Math.random() < 0.25; // 25% chance to be featured

        const songEntry = {
          title: songName.replace(/-/g, ' ').replace(/_/g, ' '),
          artist: songData.artist,
          duration: songData.duration,
          genre: songData.genre,
          language: language,
          featured: isFeatured,
          url: generatePlaceholderUrl(songFile, language), // Placeholder URL
          thumbnail: songData.thumbnail,
          uploadedBy: user._id,
        };

        songsToInsert.push(songEntry);
        console.log(`  ✅ Prepared: ${songEntry.title} by ${songEntry.artist} (${songEntry.genre})`);
      }
      console.log('');
    }

    // Insert all songs
    await Song.insertMany(songsToInsert);
    
    // Show summary
    const featuredSongs = songsToInsert.filter(song => song.featured);
    console.log(`🎉 Successfully seeded ${songsToInsert.length} songs!`);
    console.log(`🌟 Featured songs (${featuredSongs.length}):`);
    featuredSongs.forEach(song => {
      console.log(`   - "${song.title}" by ${song.artist} (${song.genre})`);
    });

  } catch (error) {
    console.error('❌ Error seeding the database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
  }
};

seedSongsFromLocalFiles();