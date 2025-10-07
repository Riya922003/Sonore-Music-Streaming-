# AddToPlaylistModal Usage Example

This demonstrates how to use the `AddToPlaylistModal` component with the global UI context.

## Setup

The modal is controlled by the `UIContext` and automatically included in your app when you add the `UIProvider` to your provider stack.

### 1. Provider Setup (already done in main.tsx)

```tsx
import { UIProvider } from './contexts/UIContext';

// Wrap your app with UIProvider
<UIProvider>
  <App />
</UIProvider>
```

### 2. Include the Modal in Your App (already done in App.tsx)

```tsx
import AddToPlaylistModal from './components/AddToPlaylistModal';

function App() {
  return (
    <div>
      {/* Your app content */}
      
      {/* Add to Playlist Modal - automatically controlled by context */}
      <AddToPlaylistModal />
    </div>
  );
}
```

## Usage in Components

To open the modal from any component, use the `useUI` hook:

```tsx
import { useUI } from '../contexts/UIContext';
import { Song } from '../contexts/PlayerContext';

function SomeComponent() {
  const { openAddToPlaylistModal } = useUI();
  
  const handleAddToPlaylist = (song: Song) => {
    openAddToPlaylistModal(song);
  };
  
  return (
    <button onClick={() => handleAddToPlaylist(someSong)}>
      Add to Playlist
    </button>
  );
}
```

## Integration Examples

### 1. MusicPlayer Component (Already Integrated)

The `MusicPlayer` component now includes a '+' button next to the song title:

```tsx
import { useUI } from '../contexts/UIContext';
import { Plus } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const { currentSong } = usePlayer();
  const { openAddToPlaylistModal } = useUI();

  const handleAddToPlaylist = () => {
    if (currentSong) {
      openAddToPlaylistModal(currentSong);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <h4 className="text-sm font-bold text-white truncate">{currentSong.title}</h4>
      <button
        onClick={handleAddToPlaylist}
        className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
        title="Add to playlist"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
```

### 2. MusicCard Component (Already Integrated)

The `MusicCard` component now includes a three-dot menu with "Add to playlist" functionality:

```tsx
import { useUI } from '../contexts/UIContext';
import { Menu } from '@headlessui/react';
import { MoreVertical } from 'lucide-react';

const MusicCard: React.FC<MusicCardProps> = ({ song, ...otherProps }) => {
  const { openAddToPlaylistModal } = useUI();
  
  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song) {
      openAddToPlaylistModal(song);
    }
  };
  
  return (
    <div className="music-card group">
      {/* Existing card content */}
      
      {/* Three-dot menu (visible on hover) */}
      {song && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
          <Menu as="div" className="relative">
            <Menu.Button className="p-1 bg-black/50 hover:bg-black/70 rounded-full text-white">
              <MoreVertical size={16} />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleAddToPlaylist}
                    className={`${active ? 'bg-gray-700' : ''} text-white w-full px-3 py-2 text-sm`}
                  >
                    Add to playlist
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      )}
    </div>
  );
};
```

### 3. Using MusicCard with Song Data

To enable the playlist functionality, pass a `song` object to the MusicCard:

```tsx
<MusicCard
  id={song._id}
  title={song.title}
  subtitle={song.artist}
  image={song.albumArt || song.thumbnail}
  song={song} // This enables the three-dot menu
  onPlay={() => handlePlaySong(song)}
/>
```

## Features

The playlist system includes:

### AddToPlaylistModal Component:
1. **Modal Management**: Hidden by default, controlled by global state
2. **Playlist Fetching**: Automatically fetches user's playlists from `/api/playlists/my-playlists`
3. **Clickable Playlist List**: Each playlist can be clicked to add the song
4. **New Playlist Creation**: Includes a "New playlist" button with form
5. **Search Functionality**: Client-side search to filter playlists
6. **Loading States**: Shows loading indicators during API calls
7. **Error Handling**: Displays error messages for failed operations
8. **Responsive Design**: Works on various screen sizes

### Integrated Components:
1. **MusicPlayer**: '+' button next to song title for currently playing song
2. **MusicCard**: Three-dot menu (⋮) with "Add to playlist" option (hover to reveal)
3. **Accessible Design**: Uses Headless UI for keyboard navigation and screen readers
4. **Hover Interactions**: Smooth animations and transitions

## API Endpoints Used

- `GET /api/playlists/my-playlists` - Fetch user's playlists
- `POST /api/playlists/:playlistId/songs` - Add song to existing playlist
- `POST /api/playlists` - Create new playlist

## TypeScript Types

The component uses these types from the contexts:

- `Song` - From `PlayerContext`
- `Playlist` - From `PlaylistContext`
- UI state management - From `UIContext`

All contexts are properly typed for TypeScript support.

## UIContext State

The `UIContext` manages the following state for the AddToPlaylistModal:

- `songToAdd: Song | null` - The song currently being added to a playlist
- `isAddToPlaylistModalOpen: boolean` - Whether the modal is currently open
- `openAddToPlaylistModal(song: Song)` - Function to open the modal with a specific song
- `closeAddToPlaylistModal()` - Function to close the modal and clear the song