require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/Song');
const User = require('../models/User');

const thumbnailUrls = [
  'https://tse3.mm.bing.net/th/id/OIP.5FeXzul6H7eJd7xvqCxi1QHaEK?pid=Api&P=0&h=180',
  'https://tse4.mm.bing.net/th/id/OIP.29YF9Nf0pmagXJTEgpYJcAHaE8?pid=Api&P=0&h=180',
  'https://img.freepik.com/premium-photo/piece-vinyl-record-texture-isolated-white-background_936711-8523.jpg?w=2000',
  'https://tse4.mm.bing.net/th/id/OIP.RWtrD4jAW5_1KOx_mLXLIQHaFj?pid=Api&P=0&h=180',
  'https://tse1.mm.bing.net/th/id/OIP.Iwfnge35PnaYEkZOtdjwdQHaFj?pid=Api&P=0&h=180',
  'https://tse1.mm.bing.net/th/id/OIP._-m6WW5PkgPrB49LKLyh4wHaFc?pid=Api&P=0&h=180'
];

const songData = [
  // English
  { title: 'Stomp', artist: 'AlexiAction', duration: 128, genre: 'Electronic', language: 'English', url: 'https://cdn.pixabay.com/download/audio/2023/09/23/audio_73641d4677.mp3' },
  { title: 'The Beat of Nature', artist: 'Olexy', duration: 130, genre: 'Ambient', language: 'English', url: 'https://cdn.pixabay.com/download/audio/2024/02/09/audio_3d207374b6.mp3' },
  { title: 'Lofi Chill', artist: 'FASSounds', duration: 140, genre: 'Lofi', language: 'English', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_18210303a1.mp3' },
  { title: 'Ambient Classical Guitar', artist: 'William_King', duration: 180, genre: 'Ambient', language: 'English', url: 'https://cdn.pixabay.com/download/audio/2022/11/21/audio_a27084c988.mp3' },
  { title: 'Weeknds', artist: 'DayFox', duration: 195, genre: 'Pop', language: 'English', url: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_b2f1595679.mp3' },
  { title: 'Morning Garden', artist: 'Olexy', duration: 160, genre: 'Acoustic', language: 'English', url: 'https://cdn.pixabay.com/download/audio/2022/08/30/audio_336154a85b.mp3' },
  { title: 'Password Infinity', artist: 'Nico_Staf', duration: 155, genre: 'Electronic', language: 'English', url: 'https://cdn.pixabay.com/download/audio/2023/12/26/audio_255a6a36c3.mp3' },
  { title: 'Trap', artist: 'AlexiAction', duration: 110, genre: 'Hip Hop', language: 'English', url: 'https://cdn.pixabay.com/download/audio/2023/04/10/audio_243a08d989.mp3' },
  { title: 'Let It Go', artist: 'ItsWatR', duration: 132, genre: 'Pop', language: 'English', url: 'https://cdn.pixabay.com/download/audio/2022/11/11/audio_4234032483.mp3' },
  { title: 'Good Vibe', artist: 'AlexiAction', duration: 145, genre: 'Pop', language: 'English', url: 'https://cdn.pixabay.com/download/audio/2023/08/02/audio_eb7f511756.mp3' },
  
  // Hindi
  { title: 'Mumbai Midnight', artist: 'Zen_Man', duration: 170, genre: 'Bollywood', language: 'Hindi', url: 'https://cdn.pixabay.com/download/audio/2023/02/13/audio_855909ac8f.mp3' },
  { title: 'Indian Spirit', artist: 'Wolves', duration: 150, genre: 'World', language: 'Hindi', url: 'https://cdn.pixabay.com/download/audio/2023/04/01/audio_1919830541.mp3' },
  { title: 'Delhi Dreams', artist: 'SoundGallery', duration: 185, genre: 'Bollywood', language: 'Hindi', url: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_93f00a58a9.mp3' },
  { title: 'Jaipur Sunrise', artist: 'chillmore', duration: 162, genre: 'World', language: 'Hindi', url: 'https://cdn.pixabay.com/download/audio/2022/08/25/audio_41a8762740.mp3' },
  { title: 'Ganges Flow', artist: 'Ashot-Danielyan', duration: 200, genre: 'Ambient', language: 'Hindi', url: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_50231333b2.mp3' },
  { title: 'Bollywood Party', artist: 'Musictown', duration: 135, genre: 'Bollywood', language: 'Hindi', url: 'https://cdn.pixabay.com/download/audio/2023/02/13/audio_b289c89498.mp3' },
  { title: 'Himalayan Flute', artist: 'NaturesEye', duration: 220, genre: 'Meditation', language: 'Hindi', url: 'https://cdn.pixabay.com/download/audio/2023/04/24/audio_03d9735d13.mp3' },
  { title: 'Rajasthan Rhythms', artist: 'SergeQuadrado', duration: 148, genre: 'World', language: 'Hindi', url: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_141639f7d4.mp3' },
  { title: 'Taj Mahal Serenity', artist: 'Zen_Man', duration: 190, genre: 'Ambient', language: 'Hindi', url: 'https://cdn.pixabay.com/download/audio/2022/08/03/audio_37b7947171.mp3' },
  { title: 'Modern India', artist: 'QubeSounds', duration: 125, genre: 'Electronic', language: 'Hindi', url: 'https://cdn.pixabay.com/download/audio/2022/08/26/audio_83d31e975c.mp3' },
  
  // Spanish
  { title: 'Ritmo Caliente', artist: 'Anton_Vlasov', duration: 158, genre: 'Latin', language: 'Spanish', url: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_233983f23a.mp3' },
  { title: 'Barcelona Nights', artist: 'Music_For_Videos', duration: 175, genre: 'Pop', language: 'Spanish', url: 'https://cdn.pixabay.com/download/audio/2022/09/27/audio_3316938210.mp3' },
  { title: 'Spanish Guitar', artist: 'Grand_Project', duration: 140, genre: 'Acoustic', language: 'Spanish', url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_e046a11e13.mp3' },
  { title: 'Fiesta', artist: 'Olexy', duration: 130, genre: 'Latin', language: 'Spanish', url: 'https://cdn.pixabay.com/download/audio/2023/08/04/audio_328906059d.mp3' },
  { title: 'Cuban Groove', artist: 'Musictown', duration: 152, genre: 'Jazz', language: 'Spanish', url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_1c424a5f25.mp3' },
  { title: 'Andalusia', artist: 'tobylane', duration: 188, genre: 'World', language: 'Spanish', url: 'https://cdn.pixabay.com/download/audio/2022/09/05/audio_c2278e3c3b.mp3' },
  { title: 'Tango del Fuego', artist: 'Grand_Project', duration: 165, genre: 'Tango', language: 'Spanish', url: 'https://cdn.pixabay.com/download/audio/2023/04/23/audio_e9b418a09b.mp3' },
  { title: 'Salsa', artist: 'AlexiAction', duration: 142, genre: 'Latin', language: 'Spanish', url: 'https://cdn.pixabay.com/download/audio/2023/10/24/audio_a0a955c48b.mp3' },
  { title: 'Madrid Melody', artist: 'Penguinmusic', duration: 133, genre: 'Pop', language: 'Spanish', url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_fd0766a50e.mp3' },
  { title: 'Latin Summer', artist: 'Keyframe_Audio', duration: 120, genre: 'Latin', language: 'Spanish', url: 'https://cdn.pixabay.com/download/audio/2021/07/11/audio_133857e4e0.mp3' },
  
  // Punjabi
  { title: 'Punjab Groove', artist: 'QubeSounds', duration: 145, genre: 'Bhangra', language: 'Punjabi', url: 'https://cdn.pixabay.com/download/audio/2022/08/26/audio_e7f1f31f9e.mp3' },
  { title: 'Dhol Beats', artist: 'tobylane', duration: 138, genre: 'World', language: 'Punjabi', url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_03d2e2b349.mp3' },
  { title: 'Chandigarh Night', artist: 'AlexiAction', duration: 155, genre: 'Bhangra', language: 'Punjabi', url: 'https://cdn.pixabay.com/download/audio/2023/03/10/audio_f52309ce95.mp3' },
  { title: 'Amritsar Celebration', artist: 'Musictown', duration: 160, genre: 'World', language: 'Punjabi', url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_e79c657519.mp3' },
  { title: 'Modern Bhangra', artist: 'QubeSounds', duration: 130, genre: 'Electronic', language: 'Punjabi', url: 'https://cdn.pixabay.com/download/audio/2022/08/26/audio_034c4f3465.mp3' },
  { title: 'Punjabi Wedding', artist: 'AShamaluevMusic', duration: 175, genre: 'Bhangra', language: 'Punjabi', url: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_349d53351a.mp3' },
  { title: 'Vaisakhi', artist: 'Wolves', duration: 142, genre: 'World', language: 'Punjabi', url: 'https://cdn.pixabay.com/download/audio/2023/03/30/audio_5179237699.mp3' },
  { title: 'Lohri Fire', artist: 'SergeQuadrado', duration: 150, genre: 'World', language: 'Punjabi', url: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_f2d5966c4c.mp3' },
  { title: 'Golden Temple', artist: 'Zen_Man', duration: 210, genre: 'Meditation', language: 'Punjabi', url: 'https://cdn.pixabay.com/download/audio/2022/08/03/audio_c48b26c68a.mp3' },
  { title: 'Fields of Punjab', artist: 'NaturesEye', duration: 198, genre: 'Ambient', language: 'Punjabi', url: 'https://cdn.pixabay.com/download/audio/2023/04/24/audio_d20a11a84f.mp3' },
  
  // Other Languages & Genres
  { title: 'African Savannah', artist: 'Grand_Project', duration: 160, genre: 'African', language: 'Instrumental', url: 'https://cdn.pixabay.com/download/audio/2023/04/23/audio_9242551a1c.mp3' },
  { title: 'Tokyo Lofi', artist: 'FASSounds', duration: 180, genre: 'Lofi', language: 'Japanese', url: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_1482d56bce.mp3' },
  { title: 'Irish Jig', artist: 'AShamaluevMusic', duration: 120, genre: 'Folk', language: 'Irish', url: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_c3e60a9c8f.mp3' },
  { title: 'Arabian Nights', artist: 'SergeQuadrado', duration: 170, genre: 'Arabic', language: 'Arabic', url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_573f360e22.mp3' },
  { title: 'French Cafe', artist: 'Music_For_Videos', duration: 145, genre: 'Jazz', language: 'French', url: 'https://cdn.pixabay.com/download/audio/2022/09/27/audio_c1e29e92d7.mp3' },
  { title: 'Brazilian Samba', artist: 'Olexy', duration: 135, genre: 'Samba', language: 'Portuguese', url: 'https://cdn.pixabay.com/download/audio/2023/08/04/audio_55a297fc95.mp3' },
  { title: 'K-Pop Vibe', artist: 'QubeSounds', duration: 128, genre: 'K-Pop', language: 'Korean', url: 'https://cdn.pixabay.com/download/audio/2023/03/10/audio_17a419c8f0.mp3' },
  { title: 'Russian Folk', artist: 'Grand_Project', duration: 155, genre: 'Folk', language: 'Russian', url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_03d9735d13.mp3' },
  { title: 'German Polka', artist: 'Musictown', duration: 140, genre: 'Folk', language: 'German', url: 'https://cdn.pixabay.com/download/audio/2022/04/26/audio_9fd6b110a2.mp3' },
  { title: 'Hawaiian Ukulele', artist: 'DayFox', duration: 165, genre: 'Acoustic', language: 'Hawaiian', url: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_6590219454.mp3' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected for seeding.');

    await Song.deleteMany({});
    console.log('🧹 Cleared existing songs.');

    const user = await User.findOne();
    if (!user) {
      console.error('❌ No user found. Please create a user before seeding.');
      mongoose.disconnect();
      return;
    }
    console.log(`📝 Using user "${user.name}" as the uploader.`);

    // Create array to track which songs should be featured
    const totalSongs = songData.length;
    const featuredCount = Math.max(20, Math.floor(totalSongs * 0.4)); // At least 20 songs or 40% of total
    const featuredIndices = [];
    
    // Randomly select songs to be featured
    while (featuredIndices.length < featuredCount) {
      const randomIndex = Math.floor(Math.random() * totalSongs);
      if (!featuredIndices.includes(randomIndex)) {
        featuredIndices.push(randomIndex);
      }
    }
    
    console.log(`🌟 Making ${featuredCount} out of ${totalSongs} songs featured`);

    const songsToInsert = songData.map((song, index) => ({
      ...song,
      thumbnail: thumbnailUrls[Math.floor(Math.random() * thumbnailUrls.length)],
      featured: featuredIndices.includes(index), // true if index is in featuredIndices
      uploadedBy: user._id,
    }));

    await Song.insertMany(songsToInsert);
    
    // Log featured songs
    const featuredSongs = songsToInsert.filter(song => song.featured);
    console.log(`🌱 Successfully seeded ${songsToInsert.length} songs.`);
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

seedDB();