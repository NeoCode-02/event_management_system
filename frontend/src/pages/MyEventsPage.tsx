import React from 'react';
import { api, ApiError } from '@/api/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ToastProvider';

type Event = {
  id: string;
  title: string;
  description?: string | null;
  location: string;
  date: string;
};

type Registration = {
  id: string;
  name: string;
  surname?: string | null;
  phone: string;
  email?: string | null;
  status: 'waitlist' | 'accepted' | 'rejected' | 'cancelled';
};

const STATUS_LABEL: Record<Registration['status'], string> = {
  waitlist: 'Waitlist',
  accepted: 'Accepted',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export default function MyEventsPage() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<string | null>(null);
  const [regs, setRegs] = React.useState<Registration[]>([]);
  const [loadingRegs, setLoadingRegs] = React.useState(false);
  const [editingRegId, setEditingRegId] = React.useState<string | null>(null);
  const [openPickerFor, setOpenPickerFor] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      if (!accessToken) return;
      const es = await api.get<Event[]>('/events/my/', accessToken);
      setEvents(es);
      if (es.length > 0) {
        setSelectedEvent(es[0].id);
      }
    })();
  }, [accessToken]);

  React.useEffect(() => {
    (async () => {
      if (!selectedEvent || !accessToken) return;
      setLoadingRegs(true);
      try {
        const r = await api.get<Registration[]>(`/registrations/events/${selectedEvent}/registrations`, accessToken);
        setRegs(r);
      } catch (e: any) {
        const msg = e instanceof ApiError && e.status === 403 ? 'You are not the organizer of this event' : (e.message ?? 'Failed to load');
        showToast(msg, 'error');
      } finally {
        setLoadingRegs(false);
      }
    })();
  }, [selectedEvent, accessToken]);

  const updateStatus = async (reg: Registration, newStatus: Registration['status']) => {
    if (!accessToken) return;
    setEditingRegId(reg.id);
    try {
      const updated = await api.put<Registration>(`/registrations/registrations/${reg.id}`, { status: newStatus }, accessToken);
      setRegs((list) => list.map((x) => (x.id === reg.id ? updated : x)));
      setOpenPickerFor(null);
      showToast('Status updated', 'success');
    } catch (e: any) {
      showToast(e.message ?? 'Update failed', 'error');
    } finally {
      setEditingRegId(null);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">My events</h1>

      {events.length > 0 ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {events.map((e) => (
            <button
              key={e.id}
              className={`btn ${selectedEvent === e.id ? '' : 'secondary'}`}
              onClick={() => setSelectedEvent(e.id)}
            >
              {e.title}
            </button>
          ))}
        </div>
      ) : (
        <div className="card">You haven't created any events yet.</div>
      )}

      {selectedEvent && (
        <div className="card">
          <h3>Registrations</h3>
          {loadingRegs && <div>Loading…</div>}
          {!loadingRegs && regs.length === 0 && <div>No registrations yet.</div>}
          {!loadingRegs && regs.length > 0 && (
            <div className="grid">
              {regs.map((r) => (
                <div className="card" key={r.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.name} {r.surname ?? ''}</div>
                      <div className="muted" style={{ fontSize: 14 }}>{r.phone} • {r.email ?? '-'}</div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <button
                        className="btn secondary"
                        onClick={() => setOpenPickerFor(openPickerFor === r.id ? null : r.id)}
                        disabled={editingRegId === r.id}
                        aria-haspopup="listbox"
                        aria-expanded={openPickerFor === r.id}
                      >
                        {STATUS_LABEL[r.status]}
                      </button>
                      {openPickerFor === r.id && (
                        <div role="listbox" style={{ position: 'absolute', right: 0, marginTop: 8, background: 'rgba(16,23,38,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, minWidth: 160, zIndex: 20 }}>
                          {(['waitlist','accepted','rejected','cancelled'] as const).map((opt) => (
                            <button
                              key={opt}
                              role="option"
                              className="btn secondary"
                              style={{ display: 'block', width: '100%', borderRadius: 0, textAlign: 'left', padding: '10px 12px', border: 'none' }}
                              disabled={editingRegId === r.id || opt === r.status}
                              onClick={() => updateStatus(r, opt)}
                            >
                              {STATUS_LABEL[opt]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


