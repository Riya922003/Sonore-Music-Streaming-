require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/Song');
const User = require('../models/User');

// Popular current songs with working URLs
const popularSongs = [
  // Latest English Hits
  {
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    duration: 174,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_b2f1595679.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    duration: 200,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/08/02/audio_eb7f511756.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
  },
  {
    title: 'Bad Habits',
    artist: 'Ed Sheeran',
    duration: 231,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/11/11/audio_4234032483.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  {
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    duration: 263,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/30/audio_336154a85b.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  {
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    duration: 141,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/09/23/audio_73641d4677.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
  },
  {
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    duration: 200,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2024/02/09/audio_3d207374b6.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  {
    title: 'Flowers',
    artist: 'Miley Cyrus',
    duration: 200,
    genre: 'Pop',
    language: 'english',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_18210303a1.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },

  // Latest Punjabi Hits
  {
    title: 'Excuses',
    artist: 'AP Dhillon',
    duration: 187,
    genre: 'Punjabi Pop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/26/audio_e7f1f31f9e.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  {
    title: 'Brown Munde',
    artist: 'AP Dhillon ft. Gurinder Gill',
    duration: 203,
    genre: 'Punjabi Hip Hop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_03d2e2b349.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  {
    title: 'Insane',
    artist: 'AP Dhillon',
    duration: 176,
    genre: 'Punjabi Trap',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/03/10/audio_f52309ce95.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  {
    title: 'We Rollin',
    artist: 'Shubh',
    duration: 156,
    genre: 'Punjabi Pop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/26/audio_034c4f3465.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  {
    title: 'No Competition',
    artist: 'Shubh',
    duration: 189,
    genre: 'Punjabi Urban',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_349d53351a.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  {
    title: 'Elevated',
    artist: 'Shubh',
    duration: 172,
    genre: 'Punjabi Pop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/03/30/audio_5179237699.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  {
    title: 'Softly',
    artist: 'Karan Aujla',
    duration: 234,
    genre: 'Punjabi Rap',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_f2d5966c4c.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  {
    title: 'Admirin You',
    artist: 'Karan Aujla',
    duration: 198,
    genre: 'Punjabi Romance',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/03/audio_c48b26c68a.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
  },
  {
    title: 'G.O.A.T',
    artist: 'Diljit Dosanjh',
    duration: 198,
    genre: 'Punjabi Pop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/04/24/audio_d20a11a84f.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  {
    title: 'Born to Shine',
    artist: 'Diljit Dosanjh',
    duration: 215,
    genre: 'Punjabi Pop',
    language: 'punjabi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_e79c657519.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },

  // Latest Hindi Hits
  {
    title: 'Kesariya',
    artist: 'Arijit Singh',
    duration: 267,
    genre: 'Bollywood Romance',
    language: 'hindi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/02/13/audio_855909ac8f.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
  },
  {
    title: 'Agar Tum Saath Ho',
    artist: 'Alka Yagnik & Arijit Singh',
    duration: 278,
    genre: 'Bollywood Romance',
    language: 'hindi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2023/04/01/audio_1919830541.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
  },
  {
    title: 'Apna Bana Le',
    artist: 'Arijit Singh',
    duration: 245,
    genre: 'Bollywood Pop',
    language: 'hindi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_93f00a58a9.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  {
    title: 'Raataan Lambiyan',
    artist: 'Tanishk Bagchi',
    duration: 189,
    genre: 'Bollywood Romance',
    language: 'hindi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/08/25/audio_41a8762740.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
  },
  {
    title: 'Dil Bechara',
    artist: 'A.R. Rahman',
    duration: 223,
    genre: 'Bollywood',
    language: 'hindi',
    featured: true,
    url: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_50231333b2.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
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
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  {
    title: 'Levitating',
    artist: 'Dua Lipa',
    duration: 203,
    genre: 'Pop',
    language: 'english',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2023/04/10/audio_243a08d989.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
  },
  {
    title: 'Industry Baby',
    artist: 'Lil Nas X ft. Jack Harlow',
    duration: 212,
    genre: 'Hip Hop',
    language: 'english',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2022/11/21/audio_a27084c988.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  {
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    duration: 178,
    genre: 'Pop Rock',
    language: 'english',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_233983f23a.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  {
    title: 'Same Beef',
    artist: 'Sidhu Moose Wala',
    duration: 234,
    genre: 'Punjabi Hip Hop',
    language: 'punjabi',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2022/09/27/audio_3316938210.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  {
    title: 'Legend',
    artist: 'Sidhu Moose Wala',
    duration: 198,
    genre: 'Punjabi Rap',
    language: 'punjabi',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_e046a11e13.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop'
  },
  {
    title: 'Burj Khalifa',
    artist: 'Laxmii',
    duration: 156,
    genre: 'Bollywood Dance',
    language: 'hindi',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2023/08/04/audio_328906059d.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  {
    title: 'Param Sundari',
    artist: 'Shreya Ghoshal',
    duration: 187,
    genre: 'Bollywood',
    language: 'hindi',
    featured: false,
    url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_1c424a5f25.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
  }
];

const seedPopularSongs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected for seeding popular songs.');

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
    const songsToInsert = popularSongs.map(song => ({
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

    console.log(`🎉 Successfully seeded ${songsToInsert.length} popular songs!`);
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

  } catch (error) {
    console.error('❌ Error seeding the database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
  }
};

seedPopularSongs();