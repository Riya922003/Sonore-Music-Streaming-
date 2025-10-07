# LibraryModal Component Usage

The `LibraryModal` component provides a searchable interface for viewing and navigating to user playlists, similar to the `SearchModal` but focused on the user's personal library.

## Features

### Core Functionality:
1. **Playlist Fetching**: Automatically fetches user's playlists from `/api/playlists/my-playlists` when opened
2. **Local Search**: Real-time client-side filtering of playlists by name and description
3. **Navigation**: Clicking on a playlist navigates to `/playlist/:id` (placeholder route)
4. **Modal Management**: Hidden by default, controlled by global UI state

### UI/UX Features:
1. **Responsive Design**: Works on various screen sizes with scrollable content
2. **Loading States**: Shows loading spinner while fetching playlists
3. **Error Handling**: Displays error messages and retry functionality
4. **Empty States**: Different messages for no playlists vs no search results
5. **Keyboard Navigation**: Supports Escape key to close modal
6. **Auto-focus**: Search input is automatically focused when modal opens

## Setup

The modal is controlled by the `UIContext` and automatically included in your app.

### 1. Context Integration (already done)

```tsx
import { UIProvider } from './contexts/UIContext';

// The UIProvider is already wrapped in your app
<UIProvider>
  <App />
</UIProvider>
```

### 2. Component Integration (already done)

```tsx
import LibraryModal from './components/LibraryModal';

function App() {
  return (
    <div>
      {/* Your app content */}
      
      {/* Library Modal - automatically controlled by UIContext */}
      <LibraryModal />
    </div>
  );
}
```

### 3. Sidebar Integration (already done)

The "Your Library" item in the sidebar is already connected to open the modal:

```tsx
import { useUI } from '../contexts/UIContext';

function Sidebar() {
  const { openLibraryModal } = useUI();
  
  // Navigation items with click handlers
  const navigationItems = [
    { icon: Library, label: 'Your Library', onClick: openLibraryModal },
  ];
}
```

## Usage

### Opening the Modal

From any component, use the `useUI` hook:

```tsx
import { useUI } from '../contexts/UIContext';

function SomeComponent() {
  const { openLibraryModal } = useUI();
  
  return (
    <button onClick={openLibraryModal}>
      Open Library
    </button>
  );
}
```

### Navigation Behavior

When a user clicks on a playlist, the modal will:
1. Navigate to `/playlist/:id` using `window.location.href` (temporary implementation)
2. Close the modal automatically
3. Log the selected playlist for debugging

**Note**: For production, you should replace the navigation with your preferred routing solution (React Router, Next.js Router, etc.):

```tsx
// Example with React Router
import { useNavigate } from 'react-router-dom';

const handlePlaylistSelect = (playlist: Playlist) => {
  navigate(`/playlist/${playlist._id}`);
  closeLibraryModal();
};
```

## API Requirements

### Endpoint: `GET /api/playlists/my-playlists`

The component expects this endpoint to return an array of playlist objects with the following structure:

```typescript
interface Playlist {
  _id: string;
  name: string;
  description?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}
```

### Response Format

```json
[
  {
    "_id": "playlist-id-1",
    "name": "My Favorite Songs",
    "description": "A collection of my favorite tracks",
    "songs": [
      {
        "_id": "song-id-1",
        "title": "Song Title",
        "artist": "Artist Name",
        "albumArt": "https://example.com/album-art.jpg"
      }
    ],
    "createdBy": {
      "_id": "user-id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## UI States

### 1. Loading State
- Shows spinning loader with "Loading playlists..." message
- Displayed while fetching data from API

### 2. Empty Library
- Shows music note icon with "No playlists yet" message
- Suggests creating first playlist

### 3. Search Results
- Shows filtered playlists based on search query
- "No playlists found" message when search yields no results

### 4. Error State
- Shows error icon with error message
- Includes "Try Again" button to retry fetching

### 5. Success State
- Shows list of playlists with thumbnails (first song's album art)
- Displays playlist name, song count, and description
- Hover effects and navigation arrows

## Styling

The component uses Tailwind CSS classes and matches the design system of other modals in the app:

- **Background**: Dark overlay with backdrop blur
- **Modal**: Gray-900 background with border
- **Colors**: White text, gray accents, blue hover states
- **Icons**: Lucide React icons for consistency
- **Animations**: Smooth transitions and hover effects

## UIContext State

The `UIContext` manages these states for the LibraryModal:

- `isLibraryModalOpen: boolean` - Whether the modal is currently open
- `openLibraryModal()` - Function to open the modal
- `closeLibraryModal()` - Function to close the modal

## Future Enhancements

1. **Advanced Routing**: Replace `window.location.href` with proper router integration
2. **Playlist Actions**: Add context menus for edit/delete operations
3. **Sorting Options**: Add sort by name, date created, song count
4. **Grid View**: Optional grid layout for playlists with larger thumbnails
5. **Keyboard Navigation**: Arrow key navigation through playlist list
6. **Recent Playlists**: Show recently played/modified playlists at the top