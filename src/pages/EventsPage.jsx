import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const filters = ['All', 'Summit', 'Workshop', 'Seminar', 'Funding'];

const cardGradients = {
  Summit:   'linear-gradient(135deg,#001d5c,#1a56db 55%,#4f46e5)',
  Workshop: 'linear-gradient(135deg,#0891b2,#059669)',
  Seminar:  'linear-gradient(135deg,#7c3aed,#ec4899)',
  Funding:  'linear-gradient(135deg,#f59e0b,#f97316)',
};

export default function EventsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.events.list(active)
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [active]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleRegister(ev) {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await api.events.register(ev.id);
      setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, enrolled: res.enrolled } : e));
      showToast(`Registered for "${ev.title}"!`);
    } catch (err) {
      showToast(err.message);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Consortium Events" title="Events & Activities" />

      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: '#001d5c', color: '#fff', borderRadius: 10, padding: '12px 24px',
          fontSize: 13.5, fontWeight: 600, zIndex: 9000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}>{toast}</div>
      )}

      <section style={{ background: '#f8fafc', padding: '32px 24px 60px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {filters.map(f => (
              <button key={f} onClick={() => setActive(f)}
                style={{
                  background: active === f ? '#001d5c' : '#fff',
                  color: active === f ? '#fff' : '#334155',
                  border: active === f ? 'none' : '1px solid #e2e8f0',
                  borderRadius: 20, padding: '6px 16px', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
              >{f}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: 14 }}>Loading events…</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
              {events.map(ev => (
                <EventCard key={ev.id} ev={{ ...ev, bg: cardGradients[ev.category] || cardGradients.Summit }}
                  onRegister={() => handleRegister(ev)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function EventCard({ ev, onRegister }) {
  const [hovered, setHovered] = useState(false);
  const pct = Math.round((ev.enrolled / ev.total) * 100);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        border: '1px solid #e2e8f0', transition: 'all 0.22s',
        boxShadow: hovered ? '0 8px 28px rgba(0,29,92,0.12)' : 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div style={{ height: 140, background: ev.bg, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            background: 'rgba(255,255,255,0.2)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 5, padding: '3px 10px', fontSize: 11, fontWeight: 700,
          }}>{ev.category}</span>
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11.5 }}>{ev.date}</span>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', lineHeight: 1.3, marginBottom: 8 }}>{ev.title}</h3>
        <div style={{ color: '#64748b', fontSize: 12.5, marginBottom: 4 }}>📍 {ev.venue}</div>
        <div style={{ color: '#64748b', fontSize: 12.5, marginBottom: 16 }}>🏛 {ev.organizer}</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#64748b', marginBottom: 6 }}>
            <span>Enrollment</span><span>{ev.enrolled}/{ev.total}</span>
          </div>
          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#f97316,#e11d48)', borderRadius: 3 }} />
          </div>
        </div>

        <button onClick={onRegister}
          disabled={ev.enrolled >= ev.total}
          style={{
            width: '100%',
            background: ev.enrolled >= ev.total ? '#e2e8f0' : 'linear-gradient(90deg,#f97316,#e11d48)',
            color: ev.enrolled >= ev.total ? '#94a3b8' : '#fff',
            border: 'none', borderRadius: 10, padding: '10px', fontSize: 13.5, fontWeight: 700,
            cursor: ev.enrolled >= ev.total ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}
          onMouseEnter={e => { if (ev.enrolled < ev.total) e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >{ev.enrolled >= ev.total ? 'Fully Booked' : 'Register'}</button>
      </div>
    </div>
  );
}
