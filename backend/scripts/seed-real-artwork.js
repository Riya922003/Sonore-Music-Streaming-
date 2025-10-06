require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/Song');
const User = require('../models/User');

// Popular current songs with REAL song-specific artwork
const popularSongsWithRealArtwork = [
  // Latest English Hits with Real Album Artwork
  {
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    duration: 174,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_b2f1595679.mp3',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273f7db43292a6a99b21b51d5b4' // Real Fine Line album cover
  },
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    duration: 200,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/08/02/audio_eb7f511756.mp3',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' // Real After Hours album cover
  },
  {
    title: 'Bad Habits',
    artist: 'Ed Sheeran',
    duration: 231,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/11/11/audio_4234032483.mp3',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273ef24c3fdbf856340d55cfeb2' // Real Bad Habits single cover
  },
  {
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    duration: 263,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/30/audio_336154a85b.mp3',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96' // Real ÷ (Divide) album cover
  },
  {
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    duration: 141,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/09/23/audio_73641d4677.mp3',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f' // Real Stay single cover
  },
  {
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    duration: 200,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2024/02/09/audio_3d207374b6.mp3',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' // Real Midnights album cover
  },
  {
    title: 'Flowers',
    artist: 'Miley Cyrus',
    duration: 200,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_18210303a1.mp3',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273f6b55ca93bd33211227b502b' // Real Flowers single cover
  },

  // Latest Punjabi Hits with Real Album Artwork
  {
    title: 'Excuses',
    artist: 'AP Dhillon',
    duration: 187,
    genre: 'Punjabi Pop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/26/audio_e7f1f31f9e.mp3',
    thumbnail: 'https://i.ytimg.com/vi/kMOeTLLeaDY/maxresdefault.jpg' // Real Excuses music video thumbnail
  },
  {
    title: 'Brown Munde',
    artist: 'AP Dhillon ft. Gurinder Gill',
    duration: 203,
    genre: 'Punjabi Hip Hop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_03d2e2b349.mp3',
    thumbnail: 'https://i.ytimg.com/vi/kNuaSRxrreE/maxresdefault.jpg' // Real Brown Munde music video thumbnail
  },
  {
    title: 'Insane',
    artist: 'AP Dhillon',
    duration: 176,
    genre: 'Punjabi Trap',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/03/10/audio_f52309ce95.mp3',
    thumbnail: 'https://i.ytimg.com/vi/cOWpHNWI4Xs/maxresdefault.jpg' // Real Insane music video thumbnail
  },
  {
    title: 'We Rollin',
    artist: 'Shubh',
    duration: 156,
    genre: 'Punjabi Pop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/26/audio_034c4f3465.mp3',
    thumbnail: 'https://i.ytimg.com/vi/9dU8cPDbvH8/maxresdefault.jpg' // Real We Rollin music video thumbnail
  },
  {
    title: 'No Competition',
    artist: 'Shubh',
    duration: 189,
    genre: 'Punjabi Urban',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_349d53351a.mp3',
    thumbnail: 'https://i.ytimg.com/vi/E3ow2W16Iuk/maxresdefault.jpg' // Real No Competition music video thumbnail
  },
  {
    title: 'Elevated',
    artist: 'Shubh',
    duration: 172,
    genre: 'Punjabi Pop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/03/30/audio_5179237699.mp3',
    thumbnail: 'https://i.ytimg.com/vi/u_426aBxb_8/maxresdefault.jpg' // Real Elevated music video thumbnail
  },
  {
    title: 'Softly',
    artist: 'Karan Aujla',
    duration: 234,
    genre: 'Punjabi Rap',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_f2d5966c4c.mp3',
    thumbnail: 'https://i.ytimg.com/vi/DpjI7k9SFmU/maxresdefault.jpg' // Real Softly music video thumbnail
  },
  {
    title: 'Admirin You',
    artist: 'Karan Aujla',
    duration: 198,
    genre: 'Punjabi Romance',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/03/audio_c48b26c68a.mp3',
    thumbnail: 'https://i.ytimg.com/vi/dKO8ZWtC-yk/maxresdefault.jpg' // Real Admirin You music video thumbnail
  },
  {
    title: 'G.O.A.T',
    artist: 'Diljit Dosanjh',
    duration: 198,
    genre: 'Punjabi Pop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/04/24/audio_d20a11a84f.mp3',
    thumbnail: 'https://i.ytimg.com/vi/Qo7qKdBsYW8/maxresdefault.jpg' // Real G.O.A.T music video thumbnail
  },
  {
    title: 'Born to Shine',
    artist: 'Diljit Dosanjh',
    duration: 215,
    genre: 'Punjabi Pop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_e79c657519.mp3',
    thumbnail: 'https://i.ytimg.com/vi/WoVyC4bBUaU/maxresdefault.jpg' // Real Born to Shine music video thumbnail
  },

  // Latest Hindi Hits with Real Album Artwork
  {
    title: 'Kesariya',
    artist: 'Arijit Singh',
    duration: 267,
    genre: 'Bollywood Romance',
    language: 'hindi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/02/13/audio_855909ac8f.mp3',
    thumbnail: 'https://i.ytimg.com/vi/BddP6PYo2gs/maxresdefault.jpg' // Real Kesariya music video thumbnail
  },
  {
    title: 'Agar Tum Saath Ho',
    artist: 'Alka Yagnik & Arijit Singh',
    duration: 278,
    genre: 'Bollywood Romance',
    language: 'hindi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/04/01/audio_1919830541.mp3',
    thumbnail: 'https://i.ytimg.com/vi/kUzSM8fDlJU/maxresdefault.jpg' // Real Agar Tum Saath Ho music video thumbnail
  },
  {
    title: 'Apna Bana Le',
    artist: 'Arijit Singh',
    duration: 245,
    genre: 'Bollywood Pop',
    language: 'hindi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_93f00a58a9.mp3',
    thumbnail: 'https://i.ytimg.com/vi/KWqMuqjwS3Q/maxresdefault.jpg' // Real Apna Bana Le music video thumbnail
  },
  {
    title: 'Raataan Lambiyan',
    artist: 'Tanishk Bagchi',
    duration: 189,
    genre: 'Bollywood Romance',
    language: 'hindi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/25/audio_41a8762740.mp3',
    thumbnail: 'https://i.ytimg.com/vi/B4r4lJRW1xo/maxresdefault.jpg' // Real Raataan Lambiyan music video thumbnail
  },
  {
    title: 'Dil Bechara',
    artist: 'A.R. Rahman',
    duration: 223,
    genre: 'Bollywood',
    language: 'hindi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_50231333b2.mp3',
    thumbnail: 'https://i.ytimg.com/vi/mM0-ZerxIBc/maxresdefault.jpg' // Real Dil Bechara music video thumbnail
  },

  // Additional popular songs (not featured but still popular)
  {
    title: 'As It Was',
    artist: 'Harry Styles',
    duration: 167,
    genre: 'Pop',
    language: 'english',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2023/12/26/audio_255a6a36c3.mp3',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14' // Real Harry's House album cover
  },
  {
    title: 'Levitating',
    artist: 'Dua Lipa',
    duration: 203,
    genre: 'Pop',
    language: 'english',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2023/04/10/audio_243a08d989.mp3',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273f27299ca7b4adac9fb6d6641' // Real Future Nostalgia album cover
  },
  {
    title: 'Industry Baby',
    artist: 'Lil Nas X ft. Jack Harlow',
    duration: 212,
    genre: 'Hip Hop',
    language: 'english',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2022/11/21/audio_a27084c988.mp3',
    thumbnail: 'https://i.ytimg.com/vi/UTHLKHL_whs/maxresdefault.jpg' // Real Industry Baby music video thumbnail
  },
  {
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    duration: 178,
    genre: 'Pop Rock',
    language: 'english',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_233983f23a.mp3',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a' // Real SOUR album cover
  },
  {
    title: 'Same Beef',
    artist: 'Sidhu Moose Wala',
    duration: 234,
    genre: 'Punjabi Hip Hop',
    language: 'punjabi',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2022/09/27/audio_3316938210.mp3',
    thumbnail: 'https://i.ytimg.com/vi/mKNycynWP0w/maxresdefault.jpg' // Real Same Beef music video thumbnail
  },
  {
    title: 'Legend',
    artist: 'Sidhu Moose Wala',
    duration: 198,
    genre: 'Punjabi Rap',
    language: 'punjabi',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_e046a11e13.mp3',
    thumbnail: 'https://i.ytimg.com/vi/RSVX4ya8zDo/maxresdefault.jpg' // Real Legend music video thumbnail
  },
  {
    title: 'Burj Khalifa',
    artist: 'Laxmii',
    duration: 156,
    genre: 'Bollywood Dance',
    language: 'hindi',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2023/08/04/audio_328906059d.mp3',
    thumbnail: 'https://i.ytimg.com/vi/JFcgOboQZ08/maxresdefault.jpg' // Real Burj Khalifa music video thumbnail
  },
  {
    title: 'Param Sundari',
    artist: 'Shreya Ghoshal',
    duration: 187,
    genre: 'Bollywood',
    language: 'hindi',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_1c424a5f25.mp3',
    thumbnail: 'https://i.ytimg.com/vi/P5CbqRsUKJE/maxresdefault.jpg' // Real Param Sundari music video thumbnail
  }
];

const seedSongsWithRealArtwork = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected for seeding songs with real artwork.');

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

    // Add uploader to each song
    const songsToInsert = popularSongsWithRealArtwork.map(song => ({
      ...song,
      uploadedBy: user._id,
    }));

    // Insert all songs
    await Song.insertMany(songsToInsert);
    
    // Show summary
    const featuredSongs = songsToInsert.filter(song => song.featured);
    const englishFeatured = featuredSongs.filter(song => song.language === 'english');
    const punjabiFeatured = featuredSongs.filter(song => song.language === 'punjabi');
    const hindiFeatured = featuredSongs.filter(song => song.language === 'hindi');

    console.log(`🎉 Successfully seeded ${songsToInsert.length} songs with REAL artwork!`);
    console.log(`🖼️  Each song now has its own specific album cover or music video thumbnail!`);
    console.log(`🌟 Featured songs (${featuredSongs.length} total):`);
    console.log(`   🎵 English: ${englishFeatured.length} songs`);
    englishFeatured.forEach(song => {
      console.log(`      - "${song.title}" by ${song.artist}`);
    });
    console.log(`   🎵 Punjabi: ${punjabiFeatured.length} songs`);
    punjabiFeatured.forEach(song => {
      console.log(`      - "${song.title}" by ${song.artist}`);
    });
    console.log(`   🎵 Hindi: ${hindiFeatured.length} songs`);
    hindiFeatured.forEach(song => {
      console.log(`      - "${song.title}" by ${song.artist}`);
    });

    console.log(`\n📊 Language distribution:`);
    console.log(`   English: ${songsToInsert.filter(s => s.language === 'english').length} songs`);
    console.log(`   Punjabi: ${songsToInsert.filter(s => s.language === 'punjabi').length} songs`);
    console.log(`   Hindi: ${songsToInsert.filter(s => s.language === 'hindi').length} songs`);

    console.log(`\n🎨 Artwork sources:`);
    console.log(`   - Spotify album covers for English songs`);
    console.log(`   - YouTube music video thumbnails for Punjabi songs`);
    console.log(`   - YouTube music video thumbnails for Hindi songs`);

  } catch (error) {
    console.error('❌ Error seeding the database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
  }
};

seedSongsWithRealArtwork();