import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/api/client';
import { useToast } from '@/components/ToastProvider';

export function DashboardPage() {
  const { user, accessToken } = useAuth();
  const [form, setForm] = React.useState({ title: '', description: '', location: '', date: '', is_public: false });
  const [loading, setLoading] = React.useState(false);
  const { showToast } = useToast();

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return alert('Login required');
    setLoading(true);
    try {
      const payload = { ...form, date: new Date(form.date).toISOString() };
      const now = new Date();
      const dt = new Date(form.date);
      if (!(dt instanceof Date) || isNaN(dt.getTime())) throw new Error('Invalid date');
      if (dt < now) throw new Error('Date must be in the future');
      await api.post('/events/events/', payload, accessToken);
      setForm({ title: '', description: '', location: '', date: '', is_public: false });
      showToast('Event created', 'success');
    } catch (err: any) {
      showToast(err.message ?? 'Create failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>
      {!user && <div className="card">Please login to create events.</div>}
      {user && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3>Create event</h3>
            <form className="form" onSubmit={createEvent}>
              <div className="field">
                <label>Title</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="field">
                <label>Location</label>
                <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div className="field">
                <label>Date</label>
                <input type="datetime-local" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input id="is_public" type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} />
                <label htmlFor="is_public">Public event</label>
              </div>
              <div className="actions">
                <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
          <div className="card">To manage your events and registrations, go to My events.</div>
        </>
      )}
    </div>
  );
}


