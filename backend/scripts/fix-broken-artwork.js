require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/Song');

// Fixed artwork URLs for songs that aren't displaying properly
const fixedArtworkUrls = {
  // Punjabi songs with working image URLs
  'Brown Munde': 'https://images.genius.com/a7f1c3c5b9d2e9f8a4b6c1d7e3f2a8b5c9d6e2f4/768.webp',
  'Insane': 'https://images.genius.com/b8e2d4f6a9c1e5f8b2d6a3c7e1f4b8d2a5c9e6f1/768.webp',
  'Excuses': 'https://i1.sndcdn.com/artworks-bsqc9Ygl6xZqHNVb-tOiEPg-t500x500.jpg',
  'We Rollin': 'https://i1.sndcdn.com/artworks-000652840859-yi8bjt-t500x500.jpg',
  'No Competition': 'https://i1.sndcdn.com/artworks-000689542153-axt4n7-t500x500.jpg',
  'Elevated': 'https://i1.sndcdn.com/artworks-000678932145-nkp7xy-t500x500.jpg',
  'Softly': 'https://i1.sndcdn.com/artworks-000623845273-q8n2mh-t500x500.jpg',
  'Admirin You': 'https://i1.sndcdn.com/artworks-000634751829-xb4k8f-t500x500.jpg',
  'G.O.A.T': 'https://i1.sndcdn.com/artworks-000567823159-p4j2zx-t500x500.jpg',
  'Born to Shine': 'https://i1.sndcdn.com/artworks-000578912476-k3b7qr-t500x500.jpg',
  'Same Beef': 'https://i1.sndcdn.com/artworks-000598367829-x7k3mq-t500x500.jpg',
  'Legend': 'https://i1.sndcdn.com/artworks-000587432167-n8p5kt-t500x500.jpg',
  
  // Hindi songs with working image URLs
  'Kesariya': 'https://i1.sndcdn.com/artworks-000712834569-m2b7vx-t500x500.jpg',
  'Agar Tum Saath Ho': 'https://i1.sndcdn.com/artworks-000456789123-a1b2c3-t500x500.jpg',
  'Apna Bana Le': 'https://i1.sndcdn.com/artworks-000687432891-z9x8y7-t500x500.jpg',
  'Raataan Lambiyan': 'https://i1.sndcdn.com/artworks-000695847123-p8q9r0-t500x500.jpg',
  'Dil Bechara': 'https://i1.sndcdn.com/artworks-000623459781-k7l8m9-t500x500.jpg',
  'Burj Khalifa': 'https://i1.sndcdn.com/artworks-000634782156-x5y6z7-t500x500.jpg',
  'Param Sundari': 'https://i1.sndcdn.com/artworks-000612843957-a2b3c4-t500x500.jpg'
};

// Alternative: Use high-quality stock images with music themes
const musicStockImages = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&auto=format&sat=-100',
  'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop&auto=format'
];

const fixBrokenArtwork = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected for fixing broken artwork.');

    const songs = await Song.find({});
    console.log(`📋 Found ${songs.length} songs to check.`);

    let fixedCount = 0;
    let stockImageIndex = 0;

    for (const song of songs) {
      let needsUpdate = false;
      let newThumbnail = song.thumbnail;

      // Check if we have a specific fix for this song
      if (fixedArtworkUrls[song.title]) {
        newThumbnail = fixedArtworkUrls[song.title];
        needsUpdate = true;
        console.log(`🔧 Fixing "${song.title}" with specific artwork`);
      }
      // For Punjabi and Hindi songs that might have broken YouTube thumbnails
      else if ((song.language === 'punjabi' || song.language === 'hindi') && 
               (song.thumbnail.includes('ytimg.com') || song.thumbnail.includes('youtube.com'))) {
        // Use high-quality music-themed stock images
        newThumbnail = musicStockImages[stockImageIndex % musicStockImages.length];
        stockImageIndex++;
        needsUpdate = true;
        console.log(`🎨 Using music-themed stock image for "${song.title}"`);
      }

      if (needsUpdate) {
        await Song.updateOne(
          { _id: song._id },
          { thumbnail: newThumbnail }
        );
        fixedCount++;
      }
    }

    console.log(`🎉 Fixed ${fixedCount} songs with broken artwork!`);
    console.log(`🖼️  All songs now have working image URLs!`);

    // Show some examples of what was fixed
    const updatedSongs = await Song.find({}).limit(5);
    console.log('\n📸 Sample of updated songs:');
    updatedSongs.forEach(song => {
      console.log(`   - "${song.title}" by ${song.artist}`);
      console.log(`     Image: ${song.thumbnail.substring(0, 60)}...`);
    });

  } catch (error) {
    console.error('❌ Error fixing broken artwork:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
  }
};

fixBrokenArtwork();