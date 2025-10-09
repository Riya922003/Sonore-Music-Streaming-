const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// --- CONFIGURATION ---
const API_URL = 'http://localhost:5000/api/songs/upload'; 
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTI3ZTAyNDJiYzY1ZjMyZjgxZWZjMSIsIm5hbWUiOiJSaXlhMSIsImVtYWlsIjoicml5YTFAZ21haWwuY29tIiwiaWF0IjoxNzYwMDA0NTYyLCJleHAiOjE3NjAwMjI1NjJ9.P-yRA1RadF1TqMgXfa_982Wl_AZTcNYoUgEU8w273mo'; 
const SONGS_BASE_DIRECTORY = path.join(__dirname, '..', 'songs-to-upload');
const TEMP_THUMBNAIL_PATH = path.join(__dirname, 'temp_thumbnail.jpg');
// --- END CONFIGURATION ---
const DRY_RUN = process.env.SEED_DRY === '1' || false;

// Only keep metadata for the English files that exist in songs-to-upload/english
// Song metadata with updated image URLs
const songMetadata = {
  '2002 - Anne-Marie': {
    artist: 'Anne-Marie',
    duration: 220,
    genre: 'Pop',
    thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b2739aba353ea2715cf9ca3bd9c4&f=1&nofb=1'
  },
  'bad guy': {
    artist: 'Billie Eilish',
    duration: 194,
    genre: 'Alternative',
    thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets.exclaim.ca%2Fimage%2Fupload%2Fv1704038657%2Fbillie_eilish_bad_guy.jpg&f=1&nofb=1&ipt=4081bfc70e9b27183c086460cd47a5623226053996ed091ba87be68b64f83b1e'
  },
  'Believer': {
    artist: 'Imagine Dragons',
    duration: 204,
    genre: 'Rock',
    thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fen%2F9%2F9e%2FImagine_Dragons_Evolve.png&f=1&nofb=1'
  },
  'I Like It ': {
    artist: 'Cardi B, Bad Bunny & J Balvin',
    duration: 253,
    genre: 'Hip Hop',
    thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi1.sndcdn.com%2Fartworks-000353547893-fxvmqr-t500x500.jpg&f=1&nofb=1'
  },
  'I_m a Mess': {
    artist: 'Bebe Rexha',
    duration: 189,
    genre: 'Pop',
    thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b273a318f678a133350e53f4b8ff&f=1&nofb=1'
  },
  'Kiss Me More _feat': {
    artist: 'Doja Cat feat. SZA',
    duration: 208,
    genre: 'R&B',
    thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b273be841ba4bc24340152e3a79a&f=1&nofb=1'
  },
  'Let Me Down Slowly ': {
    artist: 'Alec Benjamin',
    duration: 168,
    genre: 'Indie Pop',
    thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b273459d675aa0b6f3b211357370&f=1&nofb=1'
  },
  'Liar ': {
    artist: 'Camila Cabello',
    duration: 185,
    genre: 'Pop',
    thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi1.sndcdn.com%2Fartworks-000616692469-2ejhkd-t500x500.jpg&f=1&nofb=1'
  },
  ' Memories': {
    artist: 'Maroon 5',
    duration: 189,
    genre: 'Pop',
    thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b273e20e5c366b497518353497b0&f=1&nofb=1'
  },
  'Send My Love ': {
    artist: 'Adele',
    duration: 223,
    genre: 'Pop',
    thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fen%2F7%2F74%2FAdele_-_25_%28Official_Album_Cover%29.png&f=1&nofb=1'
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
const normalizeKey = (s) => s.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[_\s]+/g, ' ').replace(/spoti?down\.app - /, '').trim();

// Build a normalized metadata map for fuzzy lookups
const normalizedMetadata = {};
Object.keys(songMetadata).forEach(k => {
  normalizedMetadata[normalizeKey(k)] = songMetadata[k];
});

const getSongData = (songName, language) => {
  const cleanName = songName.replace(/\.[^/.]+$/, ''); // Remove extension
  if (songMetadata[cleanName]) return songMetadata[cleanName];

  const normalized = normalizeKey(cleanName);
  if (normalizedMetadata[normalized]) return normalizedMetadata[normalized];

  // fallback: parse artist/title from filename and choose random fallback values
  const parsed = parseTitleArtist(cleanName);
  const fallback = fallbackData[language.toLowerCase()] || fallbackData.english;
  return {
    artist: parsed.artist || fallback.artists[Math.floor(Math.random() * fallback.artists.length)],
    duration: Math.floor(Math.random() * 120) + 120, // 120-240 seconds
    genre: fallback.genres[Math.floor(Math.random() * fallback.genres.length)],
    thumbnail: fallback.thumbnails[Math.floor(Math.random() * fallback.thumbnails.length)]
  };
};

// Try to get official artwork from iTunes Search API
const fetchArtworkFromITunes = async (title, artist) => {
  try {
    const term = encodeURIComponent(`${title} ${artist || ''}`.trim());
    const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`;
    const res = await axios.get(url, { timeout: 10000 });
    if (res.data && res.data.results && res.data.results.length > 0) {
      const art = res.data.results[0].artworkUrl100 || res.data.results[0].artworkUrl60;
      if (art) {
        // try to get a higher resolution
        return art.replace(/100x100bb.jpg|60x60bb.jpg/, '600x600bb.jpg');
      }
    }
  } catch (err) {
    // silently fail and return null
  }
  return null;
};

// parse song title and artist from filename like "SpotiDown.App - Title - Artist"
const parseTitleArtist = (rawName) => {
  let name = rawName.replace(/\.[^/.]+$/, '');
  if (name.startsWith('SpotiDown.App - ')) {
    name = name.replace('SpotiDown.App - ', '');
  }
  const parts = name.split(' - ');
  if (parts.length >= 2) {
    const artist = parts.pop().trim();
    const title = parts.join(' - ').trim();
    return { title, artist };
  }
  return { title: name.trim(), artist: '' };
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
    // Step 1: Try to fetch official artwork from iTunes first
    const { title, artist } = parseTitleArtist(songName);
    try {
      const fetched = await fetchArtworkFromITunes(title, songData.artist || artist);
      if (fetched) {
        songData.thumbnail = fetched;
        console.log(`  - Found artwork on iTunes: ${fetched}`);
      } else {
        console.log(`  - Using configured thumbnail: ${songData.thumbnail}`);
      }
    } catch (e) {
      console.log('  - iTunes lookup failed, using configured thumbnail');
    }

    // Download the thumbnail for upload
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
    if (DRY_RUN) {
      console.log(`  ℹ️ DRY RUN - would upload: title='${songName}', artist='${songData.artist}', duration=${songData.duration}, thumbnail='${songData.thumbnail}'\n`);
    } else {
      await axios.post(API_URL, form, {
        headers: { ...form.getHeaders(), 'x-auth-token': AUTH_TOKEN },
        timeout: 90000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      console.log(`  ✅ Success: Uploaded ${songName}\n`);
    }

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

  // Only process the 'english' folder to avoid re-uploading other languages
  const language = 'english';
  const languagePath = path.join(SONGS_BASE_DIRECTORY, language);
  if (!fs.existsSync(languagePath)) return console.error(`❌ Error: ${languagePath} not found`);
  const songFiles = fs.readdirSync(languagePath).filter(file => file.endsWith('.mp3') || file.endsWith('.wav'));

  if (songFiles.length === 0) {
    console.log(`⚠️  No songs found in ${languagePath}.\n`);
  } else {
    console.log(`🔄 Processing ${songFiles.length} songs in ${language}...`);
    for (let i = 0; i < songFiles.length; i++) {
      const songFile = songFiles[i];
      console.log(`[${i + 1}/${songFiles.length}] ${songFile}`);
      await uploadSong(path.join(languagePath, songFile), language);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    }
  }
  
  console.log('🎉 Bulk upload finished!');
};

run().catch(console.error);