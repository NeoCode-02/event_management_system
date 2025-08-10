import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/api/client';
import { useToast } from '@/components/ToastProvider';

type Event = {
  id: string;
  title: string;
  description?: string | null;
  location: string;
  date: string;
  share_uuid: string;
  is_public: boolean;
};

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = React.useState<Event | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ name: '', surname: '', phone: '', email: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const { showToast } = useToast();
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await api.get<Event>(`/events/events/${id}`);
        setEvent(data);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSubmitting(true);
      const payload = { ...form } as any;
      if (!payload.email) delete payload.email;
      await api.post(`/registrations/events/${id}/register`, payload);
      setSubmitted(true);
      setForm({ name: '', surname: '', phone: '', email: '' });
      showToast('Added to waitlist for this event.', 'success');
    } catch (err: any) {
      showToast(err.message ?? 'Registration failed', 'error');
    }
    finally { setSubmitting(false); }
  };

  return (
    <div className="container">
      {loading && <div>Loading...</div>}
      {error && <div className="card">{error}</div>}
      {event && (
        <div className="card" style={{ padding: 24 }}>
          <button className="btn secondary" onClick={() => navigate(-1)}>&larr; Back</button>
          <h1 className="page-title" style={{ marginTop: 16 }}>{event.title}</h1>
          <p className="muted">{new Date(event.date).toLocaleString()} • {event.location}</p>
          <p style={{ marginTop: 12 }}>{event.description}</p>

          <h3 style={{ marginTop: 24 }}>Register for this event</h3>
          {submitted && <div className="card" style={{ marginTop: 10 }}>You are on the waitlist. You'll be notified when status updates.</div>}
          <form className="form" onSubmit={register} style={{ marginTop: 12 }}>
            <div className="field">
              <label>Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Surname</label>
              <input className="input" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="field">
              <label>Email (optional)</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="actions">
              <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Join waitlist'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


