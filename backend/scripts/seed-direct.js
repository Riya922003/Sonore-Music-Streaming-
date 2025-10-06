const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// --- CONFIGURATION ---
const API_URL = 'http://localhost:5000/api/songs/upload'; 
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTI3ZTAyNDJiYzY1ZjMyZjgxZWZjMSIsIm5hbWUiOiJSaXlhMSIsImVtYWlsIjoicml5YTFAZ21haWwuY29tIiwiaWF0IjoxNzU5NzczMDA5LCJleHAiOjE3NTk3OTEwMDl9.XX4SgaaJYn3Hu6px2TXZ8H0BaEDAMuLeME7w8W2jSbQ'; 
const SONGS_BASE_DIRECTORY = path.join(__dirname, '..', 'songs-to-upload');
const TEMP_THUMBNAIL_PATH = path.join(__dirname, 'temp_thumbnail.jpg');
// --- END CONFIGURATION ---

// Download a default thumbnail image to use for all uploads
const downloadDefaultThumbnail = async () => {
  if (fs.existsSync(TEMP_THUMBNAIL_PATH)) {
    console.log('🖼️  Using existing temporary thumbnail');
    return TEMP_THUMBNAIL_PATH;
  }

  console.log('📥 Downloading default thumbnail...');
  try {
    const response = await axios({
      method: 'GET',
      url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(TEMP_THUMBNAIL_PATH);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('✅ Default thumbnail downloaded successfully');
        resolve(TEMP_THUMBNAIL_PATH);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('❌ Failed to download thumbnail:', error.message);
    throw error;
  }
};

// Song metadata database with specific data for each song

const songMetadata = {
  // English songs
  'bring-me-back-283196': {
    artist: 'Echo Valley',
    duration: 183,
    genre: 'Pop',
    thumbnail: 'https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=800&h=600&fit=crop'
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
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop'
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
    thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=600&fit=crop'
  },
  'what-is-not-for-me-410786': {
    artist: 'Reflection',
    duration: 207,
    genre: 'Indie Pop',
    thumbnail: 'https://images.unsplash.com/photo-1484755560615-676bb5f0e3b6?w=800&h=600&fit=crop'
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
    thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=600&fit=crop'
  },

  // Hindi songs
  'Drama Queen': {
    artist: 'Vishal Dadlani',
    duration: 195,
    genre: 'Bollywood',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop'
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
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop'
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
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  'Oh Ho Ho Ho (Remix)': {
    artist: 'Sunidhi Chauhan',
    duration: 198,
    genre: 'Bollywood Remix',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  'She Move It Like (1)': {
    artist: 'Badshah',
    duration: 167,
    genre: 'Hip Hop Hindi',
    thumbnail: 'https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=800&h=600&fit=crop'
  },
  'She Move It Like': {
    artist: 'Badshah',
    duration: 167,
    genre: 'Hip Hop Hindi',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
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
    thumbnail: 'https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=800&h=600&fit=crop'
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
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop'
  },
  'Supreme': {
    artist: 'Shubh',
    duration: 172,
    genre: 'Punjabi Pop',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop'
  },
  'Wavy (1)': {
    artist: 'Gurinder Gill',
    duration: 189,
    genre: 'Punjabi Urban',
    thumbnail: 'https://images.unsplash.com/photo-1484755560615-676bb5f0e3b6?w=800&h=600&fit=crop'
  },
  'Wavy': {
    artist: 'Gurinder Gill',
    duration: 189,
    genre: 'Punjabi Urban',
    thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=600&fit=crop'
  },
  'Winning Speech': {
    artist: 'Karan Aujla',
    duration: 234,
    genre: 'Punjabi Rap',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop'
  }
};

// Fallback data for songs not in metadata
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

const uploadSong = async (songPath, language, thumbnailPath) => {
  const songName = path.basename(songPath, path.extname(songPath));
  console.log(`Preparing: ${songName} (Language: ${language})`);

  const songData = getSongData(songName, language);
  const isFeatured = Math.random() < 0.25; // 25% chance to be featured

  try {
    const form = new FormData();
    
    // Append files
    form.append('song', fs.createReadStream(songPath));
    form.append('thumbnail', fs.createReadStream(thumbnailPath));
    
    // Append all other fields as strings
    form.append('title', songName.replace(/-/g, ' ').replace(/_/g, ' ')); 
    form.append('artist', songData.artist);
    form.append('duration', songData.duration.toString());
    form.append('language', language);
    form.append('genre', songData.genre);
    form.append('featured', isFeatured.toString()); // Convert boolean to string

    console.log(`  - Artist: ${songData.artist}`);
    console.log(`  - Duration: ${songData.duration}s`);
    console.log(`  - Genre: ${songData.genre}`);
    console.log(`  - Language: ${language}`);
    console.log(`  - Featured: ${isFeatured ? 'Yes' : 'No'}`);

    // Debug: Log the data being sent (without iterating form.entries)
    console.log('  - Sending FormData with fields: title, artist, duration, language, genre, featured, song, thumbnail');

    const response = await axios.post(API_URL, form, {
      headers: { 
        ...form.getHeaders(), 
        'x-auth-token': AUTH_TOKEN,
        'Accept': 'application/json'
      },
      timeout: 90000, // 90 second timeout
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    console.log(`  ✅ Success: Uploaded ${songName}\n`);
  } catch (error) {
    console.error(`  ❌ Critical Error for ${songName}:`);
    if (error.response) {
      console.error(`    Status: ${error.response.status}`);
      console.error(`    Data:`, error.response.data);
    } else if (error.request) {
      console.error(`    Network Error: ${error.message}`);
    } else {
      console.error(`    Error: ${error.message}`);
    }
    console.log('');
  }
};

const run = async () => {
  console.log('🎵 Starting API-based bulk upload from subfolders...\n');
  
  // Check if songs directory exists
  if (!fs.existsSync(SONGS_BASE_DIRECTORY)) {
    return console.error(`❌ Error: Directory not found at ${SONGS_BASE_DIRECTORY}`);
  }

  // Download default thumbnail first
  let thumbnailPath;
  try {
    thumbnailPath = await downloadDefaultThumbnail();
  } catch (error) {
    console.error('❌ Failed to prepare thumbnail. Exiting...');
    return;
  }

  const languageFolders = fs.readdirSync(SONGS_BASE_DIRECTORY, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (languageFolders.length === 0) {
    console.log('⚠️  No language subfolders found in songs-to-upload.');
    return;
  }

  console.log(`📁 Found ${languageFolders.length} language folders: ${languageFolders.join(', ')}\n`);

  for (const language of languageFolders) {
    console.log(`🔄 Processing folder: ${language.toUpperCase()}...`);
    const languagePath = path.join(SONGS_BASE_DIRECTORY, language);
    const files = fs.readdirSync(languagePath);
    const songFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.m4a'));

    if (songFiles.length === 0) {
      console.log(`⚠️  No songs found in ${language} folder.\n`);
      continue;
    }

    console.log(`📊 Found ${songFiles.length} songs in ${language} folder\n`);

    for (let i = 0; i < songFiles.length; i++) {
      const songFile = songFiles[i];
      console.log(`[${i + 1}/${songFiles.length}]`);
      await uploadSong(path.join(languagePath, songFile), language, thumbnailPath);
      
      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Clean up temporary thumbnail
  if (fs.existsSync(TEMP_THUMBNAIL_PATH)) {
    fs.unlinkSync(TEMP_THUMBNAIL_PATH);
    console.log('🧹 Cleaned up temporary thumbnail file');
  }
  
  console.log('🎉 Bulk upload finished!');
  console.log('📈 Summary: Check your database for all uploaded songs with proper metadata.');
};

run().catch(console.error);