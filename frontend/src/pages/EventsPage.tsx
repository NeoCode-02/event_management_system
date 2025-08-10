import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ToastProvider';
import { api } from '@/api/client';

type Event = {
  id: string;
  title: string;
  description?: string | null;
  location: string;
  date: string;
  share_uuid: string;
  is_public: boolean;
};

export function EventsPage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { showToast } = useToast();
  const [showPast, setShowPast] = React.useState(false);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const qs = showPast ? '?upcoming_only=false' : '';
      const data = await api.get<Event[]>(`/events/events/${qs}`);
      setEvents(data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, [showPast]);

  return (
    <div className="container">
      <div className="hero">
        <h1 className="page-title">Discover Events</h1>
        <p className="muted">Browse {showPast ? 'all' : 'upcoming'} events and register in one click.</p>
        <div className="actions">
          <button className="btn secondary" onClick={() => setShowPast((v) => !v)}>{showPast ? 'Hide past' : 'Show past events'}</button>
        </div>
      </div>
      {loading && <div className="card">Loading events…</div>}
      {error && <div className="card">{error} <div className="actions" style={{ marginTop: 8 }}><button className="btn" onClick={load}>Retry</button></div></div>}
      {!loading && !error && events.length === 0 && (
        <div className="card">No events yet. Check back later.</div>
      )}
      {!loading && !error && events.length > 0 && (
        <div className="grid">
          {events.map((e) => (
            <div key={e.id} className="card">
              <h3>{e.title}</h3>
              <p>{new Date(e.date).toLocaleString()} • {e.location}</p>
              <p className="muted" style={{ marginTop: 8 }}>{e.description ?? ''}</p>
              <div className="row" style={{ marginTop: 12 }}>
                <Link to={`/events/${e.id}`} className="btn">View</Link>
                <button
                  className="btn secondary"
                  onClick={async () => {
                    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/events/${e.id}`;
                    await navigator.clipboard.writeText(url);
                    showToast('Link copied to clipboard', 'success');
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


