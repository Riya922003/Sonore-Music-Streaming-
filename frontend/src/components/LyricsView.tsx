import React, { useEffect, useRef, useState } from 'react';

type SongProp = {
  _id?: string;
  title?: string;
  artist?: string;
};

type Props = {
  song: SongProp | null;
};

const LyricsView: React.FC<Props> = ({ song }) => {
  const [lyricsText, setLyricsText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const esRef = useRef<EventSource | null>(null);
  const songId = song ? song._id : null;

  useEffect(() => {
    // Reset state and prepare for new song
    setLyricsText('');
    setIsLoading(true);

    if (!songId) {
      setIsLoading(false);
      return;
    }

    // Build backend URL explicitly so the dev server doesn't swallow the request.
    const BACKEND_BASE_URL = window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://backend-deployment-u389.onrender.com';

    const url = `${BACKEND_BASE_URL}/api/songs/${songId}/lyrics/stream`;

    // Prefer fetch streaming so we can include the auth token header (EventSource can't send headers)
    const token = localStorage.getItem('authToken');
    const controller = new AbortController();
    const signal = controller.signal;

    const startFetchStream = async () => {
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: token ? { 'x-auth-token': token } : undefined,
          signal,
        });

        if (!res.ok) {
          // Try to read error message from body
          let errMsg = `Failed to start lyrics stream (status ${res.status})`;
          try {
            const txt = await res.text();
            errMsg = txt || errMsg;
          } catch {
            // ignore
          }
          setLyricsText(errMsg);
          setIsLoading(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setLyricsText('No stream available from server.');
          setIsLoading(false);
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Parse full SSE event blocks separated by two newlines
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';

          for (const part of parts) {
            if (!part) continue;
            // Extract lines that start with 'data:'
            const lines = part.split('\n').map(l => l.replace(/\r$/, '')).filter(l => l.startsWith('data:'));
            if (lines.length === 0) continue;
            const dataStr = lines.map(l => l.replace(/^data:\s?/, '')).join('\n');

            // Try parse JSON payloads
            let parsed: unknown = null;
            try {
              parsed = JSON.parse(dataStr);
            } catch {
              parsed = null;
            }

            if (parsed && typeof parsed === 'object' && parsed !== null) {
              const p = parsed as Record<string, unknown>;
              if (typeof p.chunk === 'string') {
                setLyricsText(prev => prev + p.chunk);
              } else if (typeof p.lyrics === 'string') {
                setLyricsText(p.lyrics);
                setIsLoading(false);
                controller.abort();
                return;
              } else if (typeof p.message === 'string') {
                // If the server sent a message (including 'finished' or error text), display it
                if (p.message === 'finished') {
                  setIsLoading(false);
                } else {
                  setLyricsText(prev => prev + p.message);
                }
              } else {
                // Fallback: append raw JSON as text
                setLyricsText(prev => prev + JSON.stringify(p));
              }
            } else {
              // Plain text
              setLyricsText(prev => prev + dataStr);
            }
          }
        }

        // handle remaining buffer
        if (buffer) {
          const lines = buffer.split('\n').filter(l => l.startsWith('data:'));
          const dataStr = lines.map(l => l.replace(/^data:\s?/, '')).join('\n');
          if (dataStr) setLyricsText(prev => prev + dataStr);
        }

        setIsLoading(false);
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // fetch aborted - expected on cleanup
          return;
        }
        console.error('Error fetching lyrics stream:', err);
        setLyricsText('Failed to stream lyrics.');
        setIsLoading(false);
      }
    };

    startFetchStream();

    return () => {
      controller.abort();
      esRef.current = null;
      setIsLoading(false);
    };
  }, [songId]);

  return (
    <div className="lyrics-view" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isLoading && (
        <div style={{ fontSize: 13, color: '#666' }}>Loading lyrics…</div>
      )}

      <div
        role="region"
        aria-live="polite"
        style={{
          overflowY: 'auto',
          maxHeight: '60vh',
          padding: 12,
          background: 'var(--bg-secondary, #fafafa)',
          borderRadius: 6,
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit',
          // Ensure readable text color regardless of parent context (parent uses dark text)
          color: 'var(--text-primary, #111827)'
        }}
      >
        {lyricsText && lyricsText.length > 0 ? lyricsText : (!isLoading ? 'No lyrics available.' : '')}
      </div>
    </div>
  );
};

export default LyricsView;
