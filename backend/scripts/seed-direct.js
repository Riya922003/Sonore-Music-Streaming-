const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// --- CONFIGURATION ---
const API_URL = 'http://localhost:5000/api/songs/upload'; 
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTI3ZTAyNDJiYzY1ZjMyZjgxZWZjMSIsIm5hbWUiOiJSaXlhMSIsImVtYWlsIjoicml5YTFAZ21haWwuY29tIiwiaWF0IjoxNzU5ODI1MjU2LCJleHAiOjE3NTk4NDMyNTZ9.w_T9w-k6vC8dQA7zsDfgt0x-KwK2_-hx-sqgGqpbfOw'; 
const SONGS_BASE_DIRECTORY = path.join(__dirname, '..', 'songs-to-upload');
const TEMP_THUMBNAIL_PATH = path.join(__dirname, 'temp_thumbnail.jpg');
// --- END CONFIGURATION ---

const songMetadata = {
  // English songs
  'bring-me-back-283196': {
    artist: 'Echo Valley',
    duration: 183,
    genre: 'Pop',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'celtic-irish-scottish-tin-whistle-background-music-10455': {
    artist: 'Celtic Winds',
    duration: 245,
    genre: 'Folk',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'english-poem-108554': {
    artist: 'Spoken Dreams',
    duration: 108,
    genre: 'Spoken Word',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'hark-the-herald-angels-sing-traditional-english-christmas-carol-178364': {
    artist: 'Christmas Choir',
    duration: 178,
    genre: 'Christmas',
    thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'how-far-is-it-to-bethlehem-traditional-english-christmas-carol-178351': {
    artist: 'Holiday Harmonies',
    duration: 165,
    genre: 'Christmas',
    thumbnail: 'https://images.unsplash.com/photo-1544273677-6e4141727927?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'i-want-to-dissolve-in-this-rain-405188': {
    artist: 'Rainy Day Dreams',
    duration: 225,
    genre: 'Ambient',
    thumbnail: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'noctilucent-circuit-406493': {
    artist: 'Electric Nights',
    duration: 267,
    genre: 'Electronic',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'song-english-edm-296526': {
    artist: 'Pulse Makers',
    duration: 196,
    genre: 'EDM',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'sun-beneath-a-song-410790': {
    artist: 'Golden Hour',
    duration: 243,
    genre: 'Indie',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'the-adventures-of-mr-hardy_30sec-175535': {
    artist: 'Adventure Tales',
    duration: 30,
    genre: 'Soundtrack',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'the-adventures-of-mr-hardy_60sec-175536': {
    artist: 'Adventure Tales',
    duration: 60,
    genre: 'Soundtrack',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'the-black-oath-of-white-fire-399835': {
    artist: 'Dark Symphony',
    duration: 289,
    genre: 'Cinematic',
    thumbnail: 'https://images.unsplash.com/photo-1574097656146-0b43b7660cb6?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'the-last-phantom-rose-alive-409395': {
    artist: 'Phantom Rose',
    duration: 312,
    genre: 'Gothic Rock',
    thumbnail: 'https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'the-old-mask-of-new-faces-409394': {
    artist: 'Masked Identity',
    duration: 278,
    genre: 'Alternative',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'the-shape-of-disorder-410788': {
    artist: 'Chaos Theory',
    duration: 235,
    genre: 'Experimental',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'the-song-of-alone-410791': {
    artist: 'Solitude',
    duration: 198,
    genre: 'Melancholic',
    thumbnail: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'we-wish-you-a-merry-christmas-english-carol-sheppard-flute-8848': {
    artist: 'Flute Ensemble',
    duration: 145,
    genre: 'Christmas',
    thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'what-is-not-for-me-410786': {
    artist: 'Reflection',
    duration: 207,
    genre: 'Indie Pop',
    thumbnail: 'https://images.unsplash.com/photo-1484755560615-676bb5f0e3b6?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'where-tomorrow-refuses-to-arrive-400834': {
    artist: 'Time Drift',
    duration: 256,
    genre: 'Progressive',
    thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop&auto=format&q=80'
  },
  'whispers-in-the-broken-horizon-400833': {
    artist: 'Broken Horizon',
    duration: 234,
    genre: 'Atmospheric',
    thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=600&fit=crop&auto=format&q=80'
  },

  // Hindi songs
  'Drama Queen': {
    artist: 'Vishal Dadlani',
    duration: 195,
    genre: 'Bollywood',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'Lat Lag Gayee': {
    artist: 'Benny Dayal',
    duration: 212,
    genre: 'Bollywood',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'Lonely': {
    artist: 'Armaan Malik',
    duration: 178,
    genre: 'Bollywood Pop',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'Make Some Noise For The Desi Boyz': {
    artist: 'RDB',
    duration: 223,
    genre: 'Bollywood Dance',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'mein_agar_kahoon_keys': {
    artist: 'Udit Narayan',
    duration: 267,
    genre: 'Bollywood Romance',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'Mungda': {
    artist: 'Jyotica Tangri',
    duration: 189,
    genre: 'Bollywood Item',
    thumbnail: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'Oh Ho Ho Ho (Remix)': {
    artist: 'Sunidhi Chauhan',
    duration: 198,
    genre: 'Bollywood Remix',
    thumbnail: 'https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'She Move It Like (1)': {
    artist: 'Badshah',
    duration: 167,
    genre: 'Hip Hop Hindi',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'She Move It Like': {
    artist: 'Badshah',
    duration: 167,
    genre: 'Hip Hop Hindi',
    thumbnail: 'https://images.unsplash.com/photo-1484755560615-676bb5f0e3b6?w=500&h=500&fit=crop&auto=format&q=80'
  },

  // Punjabi songs
  'Cheques': {
    artist: 'Shubh',
    duration: 156,
    genre: 'Punjabi Pop',
    thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'For A Reason (1)': {
    artist: 'Sidhu Moose Wala',
    duration: 203,
    genre: 'Punjabi Hip Hop',
    thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'For A Reason': {
    artist: 'Sidhu Moose Wala',
    duration: 203,
    genre: 'Punjabi Hip Hop',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'I Really Do....': {
    artist: 'Karan Aujla',
    duration: 187,
    genre: 'Punjabi Romance',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'MF Gabhru!': {
    artist: 'AP Dhillon',
    duration: 145,
    genre: 'Punjabi Trap',
    thumbnail: 'https://images.unsplash.com/photo-1574097656146-0b43b7660cb6?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'Supreme': {
    artist: 'Shubh',
    duration: 172,
    genre: 'Punjabi Pop',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'Wavy (1)': {
    artist: 'Gurinder Gill',
    duration: 189,
    genre: 'Punjabi Urban',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'Wavy': {
    artist: 'Gurinder Gill',
    duration: 189,
    genre: 'Punjabi Urban',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&auto=format&q=80'
  },
  'Winning Speech': {
    artist: 'Karan Aujla',
    duration: 234,
    genre: 'Punjabi Rap',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&h=500&fit=crop&auto=format&q=80'
  }
};

// Fallback data for songs not in metadata
const fallbackData = {
  english: {
    artists: ['The Beatles', 'Ed Sheeran', 'Taylor Swift', 'Adele', 'Coldplay', 'Imagine Dragons', 'OneRepublic', 'Maroon 5'],
    genres: ['Pop', 'Rock', 'Alternative', 'Indie', 'Electronic', 'Folk', 'Country', 'R&B'],
    thumbnails: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop&auto=format&q=80'
    ]
  },
  hindi: {
    artists: ['Arijit Singh', 'Shreya Ghoshal', 'Armaan Malik', 'Sunidhi Chauhan', 'Rahat Fateh Ali Khan', 'Vishal Dadlani', 'Shilpa Rao'],
    genres: ['Bollywood', 'Bollywood Pop', 'Bollywood Romance', 'Bollywood Dance', 'Sufi', 'Ghazal'],
    thumbnails: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop&auto=format&q=80'
    ]
  },
  punjabi: {
    artists: ['Sidhu Moose Wala', 'Karan Aujla', 'AP Dhillon', 'Shubh', 'Diljit Dosanjh', 'Gurdas Maan', 'Ammy Virk'],
    genres: ['Punjabi Pop', 'Punjabi Hip Hop', 'Bhangra', 'Punjabi Folk', 'Punjabi Trap', 'Punjabi Romance'],
    thumbnails: [
      'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop&auto=format&q=80'
    ]
  }
};

// // ... (Your fallbackData and getSongData functions remain the same) ...
// const fallbackData = { /* ... */ };
const getSongData = (songName, language) => {
  const cleanName = songName.replace(/\.[^/.]+$/, ''); // Remove extension
  
  if (songMetadata[cleanName]) {
    return songMetadata[cleanName];
  }
  
  // Fallback to random data
  const fallback = fallbackData[language.toLowerCase()] || fallbackData.english;
  return {
    artist: fallback.artists[Math.floor(Math.random() * fallback.artists.length)],
    duration: Math.floor(Math.random() * 120) + 120, // 120-240 seconds
    genre: fallback.genres[Math.floor(Math.random() * fallback.genres.length)],
    thumbnail: fallback.thumbnails[Math.floor(Math.random() * fallback.thumbnails.length)]
  };
};


// NEW: Function to download a specific image URL to a temporary file
const downloadImage = async (url) => {
  try {
    const response = await axios({ method: 'GET', url, responseType: 'stream' });
    const writer = fs.createWriteStream(TEMP_THUMBNAIL_PATH);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(TEMP_THUMBNAIL_PATH));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`❌ Failed to download thumbnail from ${url}:`, error.message);
    throw error;
  }
};


const uploadSong = async (songPath, language) => {
  const songName = path.basename(songPath, path.extname(songPath));
  console.log(`Preparing: ${songName} (Language: ${language})`);

  const songData = getSongData(songName, language);
  const isFeatured = Math.random() < 0.25;

  let tempThumbnailPath;
  try {
    // Step 1: Download the SPECIFIC thumbnail for this song
    console.log(`  - Downloading thumbnail: ${songData.thumbnail}`);
    tempThumbnailPath = await downloadImage(songData.thumbnail);

    // Step 2: Prepare the form with the downloaded thumbnail
    const form = new FormData();
    form.append('song', fs.createReadStream(songPath));
    form.append('thumbnail', fs.createReadStream(tempThumbnailPath)); // Use the just-downloaded file
    
    // Append all other fields
    form.append('title', songName.replace(/-/g, ' ').replace(/_/g, ' ')); 
    form.append('artist', songData.artist);
    form.append('duration', songData.duration.toString());
    form.append('language', language);
    form.append('genre', songData.genre);
    form.append('featured', isFeatured.toString());

    // Step 3: Upload to your API
    await axios.post(API_URL, form, {
      headers: { ...form.getHeaders(), 'x-auth-token': AUTH_TOKEN },
      timeout: 90000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    console.log(`  ✅ Success: Uploaded ${songName}\n`);

  } catch (error) {
    console.error(`  ❌ Critical Error for ${songName}:`);
    if (error.response) {
      console.error(`    Status: ${error.response.status}, Data:`, error.response.data);
    } else {
      console.error(`    Error: ${error.message}`);
    }
  } finally {
    // Step 4: Clean up the temporary thumbnail file for this song
    if (fs.existsSync(TEMP_THUMBNAIL_PATH)) {
      fs.unlinkSync(TEMP_THUMBNAIL_PATH);
    }
  }
};


const run = async () => {
  console.log('🎵 Starting API-based bulk upload from subfolders...\n');
  if (!fs.existsSync(SONGS_BASE_DIRECTORY)) {
    return console.error(`❌ Error: Directory not found at ${SONGS_BASE_DIRECTORY}`);
  }

  const languageFolders = fs.readdirSync(SONGS_BASE_DIRECTORY, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

  for (const language of languageFolders) {
    console.log(`🔄 Processing folder: ${language.toUpperCase()}...`);
    const languagePath = path.join(SONGS_BASE_DIRECTORY, language);
    const songFiles = fs.readdirSync(languagePath).filter(file => file.endsWith('.mp3') || file.endsWith('.wav'));

    if (songFiles.length === 0) {
      console.log(`⚠️  No songs found in ${language} folder.\n`);
      continue;
    }

    for (let i = 0; i < songFiles.length; i++) {
      const songFile = songFiles[i];
      console.log(`[${i + 1}/${songFiles.length}]`);
      // No longer need to pass thumbnailPath here
      await uploadSong(path.join(languagePath, songFile), language);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    }
  }
  
  console.log('🎉 Bulk upload finished!');
};

run().catch(console.error);