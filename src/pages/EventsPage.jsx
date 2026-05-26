import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const filters = ['All', 'Summit', 'Workshop', 'Seminar', 'Funding', 'Conference', 'Training'];

const cardGradients = {
  Summit:     'linear-gradient(135deg,#001d5c,#1a56db 55%,#4f46e5)',
  Workshop:   'linear-gradient(135deg,#0891b2,#059669)',
  Seminar:    'linear-gradient(135deg,#7c3aed,#ec4899)',
  Funding:    'linear-gradient(135deg,#f59e0b,#f97316)',
  Conference: 'linear-gradient(135deg,#0f172a,#334155)',
  Training:   'linear-gradient(135deg,#e11d48,#f97316)',
};

export default function EventsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredIds, setRegisteredIds] = useState(new Set());

  useEffect(() => {
    api.events.list(active)
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [active]);

  function openModal(ev) {
    if (!user) { navigate('/login'); return; }
    setSelectedEvent(ev);
  }

  function onRegistered(eventId, updatedEv, refNo) {
    setRegisteredIds(prev => new Set([...prev, eventId]));
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, enrolled: updatedEv.enrolled } : e));
    setSelectedEvent(prev => prev ? { ...prev, enrolled: updatedEv.enrolled, _refNo: refNo, _confirmed: true } : null);
  }

  return (
    <div>
      <PageHeader eyebrow="Consortium Events" title="Events & Activities" />

      <section style={{ background: '#f8fafc', padding: '32px 24px 60px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button key={f} onClick={() => { setActive(f); setLoading(true); }}
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
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>No events found</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
              {events.map(ev => (
                <EventCard
                  key={ev.id}
                  ev={{ ...ev, bg: cardGradients[ev.category] || cardGradients.Summit }}
                  registered={registeredIds.has(ev.id)}
                  onOpen={() => openModal(ev)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedEvent && (
        <ReservationModal
          ev={{ ...selectedEvent, bg: cardGradients[selectedEvent.category] || cardGradients.Summit }}
          user={user}
          onClose={() => setSelectedEvent(null)}
          onRegistered={onRegistered}
          alreadyRegistered={registeredIds.has(selectedEvent.id)}
        />
      )}
    </div>
  );
}

function EventCard({ ev, registered, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const pct = Math.round((ev.enrolled / ev.total) * 100);
  const full = ev.enrolled >= ev.total;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${registered ? '#a7f3d0' : '#e2e8f0'}`, transition: 'all 0.22s',
        boxShadow: hovered ? '0 8px 28px rgba(0,29,92,0.12)' : 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Banner */}
      <div style={{ height: 130, background: ev.bg, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            background: 'rgba(255,255,255,0.2)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 5, padding: '3px 10px', fontSize: 11, fontWeight: 700,
          }}>{ev.category}</span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11.5 }}>📅 {ev.date}</span>
          {ev.time && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>🕐 {ev.time}</span>}
        </div>
        {registered && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(16,185,129,0.9)', color: '#fff',
            borderRadius: 20, padding: '3px 10px', fontSize: 10.5, fontWeight: 700,
          }}>✓ Registered</div>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 800, fontSize: 15.5, color: '#0f172a', lineHeight: 1.3, marginBottom: 7 }}>{ev.title}</h3>
        <div style={{ color: '#64748b', fontSize: 12.5, marginBottom: 3 }}>📍 {ev.venue}</div>
        <div style={{ color: '#64748b', fontSize: 12.5, marginBottom: 14 }}>🏛 {ev.organizer}</div>

        {ev.minAttendance > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 600 }}>
              Min {ev.minAttendance} required
            </span>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 600 }}>
              Max {ev.total} seats
            </span>
          </div>
        )}

        {/* Capacity bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#64748b', marginBottom: 6 }}>
            <span>Seats filled</span>
            <span style={{ fontWeight: 700, color: pct >= 90 ? '#e11d48' : '#64748b' }}>{ev.enrolled}/{ev.total}</span>
          </div>
          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`, borderRadius: 3,
              background: pct >= 90 ? 'linear-gradient(90deg,#e11d48,#f97316)' : 'linear-gradient(90deg,#f97316,#e11d48)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        <button onClick={onOpen} disabled={full}
          style={{
            width: '100%',
            background: registered
              ? 'linear-gradient(90deg,#059669,#0891b2)'
              : full ? '#e2e8f0' : 'linear-gradient(90deg,#f97316,#e11d48)',
            color: full && !registered ? '#94a3b8' : '#fff',
            border: 'none', borderRadius: 10, padding: '10px', fontSize: 13.5, fontWeight: 700,
            cursor: full && !registered ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (!full) e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {full ? 'Fully Booked' : registered ? '✓ View My Registration' : 'Reserve a Seat →'}
        </button>
      </div>
    </div>
  );
}

function ReservationModal({ ev, user, onClose, onRegistered, alreadyRegistered }) {
  const [step, setStep] = useState(alreadyRegistered ? 'confirmed' : 'preview'); // preview | confirming | confirmed
  const [refNo, setRefNo] = useState(ev._refNo || null);
  const [error, setError] = useState('');
  const pct = Math.round((ev.enrolled / ev.total) * 100);

  async function handleConfirm() {
    setStep('confirming');
    setError('');
    try {
      const res = await api.events.register(ev.id);
      setRefNo(res.refNo);
      setStep('confirmed');
      onRegistered(ev.id, res, res.refNo);
    } catch (err) {
      setError(err.message);
      setStep('preview');
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,13,48,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, animation: 'fadeIn 0.2s ease',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}} @keyframes ticketIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 680,
        overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>

        {step === 'confirmed' ? (
          <ConfirmedView ev={ev} user={user} refNo={refNo} onClose={onClose} />
        ) : (
          <>
            {/* Modal header banner */}
            <div style={{ height: 160, background: ev.bg, position: 'relative', padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.22)' }} />
              <button onClick={onClose} style={{
                position: 'absolute', top: 14, right: 14, zIndex: 2,
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff', borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
                fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'inherit',
              }}>✕</button>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{
                  background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 5, padding: '3px 10px', fontSize: 11, fontWeight: 700, display: 'inline-block', marginBottom: 8,
                }}>{ev.category}</span>
                <h2 style={{ color: '#fff', margin: 0, fontSize: 20, fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.4px' }}>{ev.title}</h2>
              </div>
            </div>

            <div style={{ padding: 28 }}>
              {/* Event details row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 22 }}>
                {[
                  { icon: '📅', label: 'Date', value: ev.date },
                  { icon: '🕐', label: 'Time', value: ev.time || 'TBA' },
                  { icon: '📍', label: 'Venue', value: ev.venue },
                ].map(item => (
                  <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 12.5, color: '#0f172a', fontWeight: 600, lineHeight: 1.3 }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {ev.description && (
                <p style={{ color: '#475569', fontSize: 13.5, lineHeight: 1.7, marginBottom: 20 }}>{ev.description}</p>
              )}

              {/* Capacity + badges */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 7 }}>
                  <span>Seat availability</span>
                  <span style={{ fontWeight: 700 }}>{ev.total - ev.enrolled} of {ev.total} remaining</span>
                </div>
                <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? 'linear-gradient(90deg,#e11d48,#f97316)' : 'linear-gradient(90deg,#059669,#0891b2)', borderRadius: 4, transition: 'width 0.4s' }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {ev.minAttendance > 0 && (
                    <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                      Min {ev.minAttendance} required
                    </span>
                  )}
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                    Max {ev.total} seats
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#e2e8f0', margin: '20px 0' }} />

              {/* Your registration section */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Your Registration Details</div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: 'linear-gradient(135deg,#001d5c,#4f46e5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 18,
                  }}>{user?.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{user?.name}</div>
                    <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>{user?.email}</div>
                    {user?.institution && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{user.institution}</div>}
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{
                      background: user?.role === 'ADMIN' ? 'rgba(225,29,72,0.1)' : user?.role === 'MEMBER' ? 'rgba(74,222,128,0.12)' : 'rgba(100,116,139,0.1)',
                      color: user?.role === 'ADMIN' ? '#e11d48' : user?.role === 'MEMBER' ? '#059669' : '#64748b',
                      borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700,
                    }}>{user?.role}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, lineHeight: 1.5 }}>
                  A confirmation email will be sent to <strong>{user?.email}</strong> upon registration.
                </p>
              </div>

              {error && (
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#e11d48' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={onClose}
                  style={{
                    flex: 1, background: 'transparent', color: '#64748b',
                    border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '13px',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}>Cancel</button>
                <button onClick={handleConfirm} disabled={step === 'confirming'}
                  style={{
                    flex: 2,
                    background: step === 'confirming' ? '#94a3b8' : 'linear-gradient(90deg,#f97316,#e11d48)',
                    color: '#fff', border: 'none', borderRadius: 12, padding: '13px',
                    fontSize: 14.5, fontWeight: 700, cursor: step === 'confirming' ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.2s',
                    boxShadow: step === 'confirming' ? 'none' : '0 4px 16px rgba(249,115,22,0.35)',
                  }}
                  onMouseEnter={e => { if (step !== 'confirming') e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {step === 'confirming' ? 'Reserving your seat…' : 'Confirm Reservation →'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ConfirmedView({ ev, user, refNo, onClose }) {
  const ticketRef = refNo || `DASIG-${new Date().getFullYear()}-${String(ev.id).padStart(3,'0')}-XXXX`;

  return (
    <div style={{ padding: 32, animation: 'ticketIn 0.35s ease' }}>
      {/* Success badge */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg,#059669,#0891b2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(5,150,105,0.35)',
        }}>✓</div>
        <h2 style={{ color: '#0f172a', fontSize: 22, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Seat Reserved!</h2>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
          Confirmation sent to <strong>{user?.email}</strong>
        </p>
      </div>

      {/* Ticket */}
      <div style={{ border: '2px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
        {/* Ticket header */}
        <div style={{ background: ev.bg, padding: '20px 24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          }}>
            <span style={{ fontSize: 22 }}>🦅</span>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>DASIG Consortium Event Ticket</div>
            </div>
          </div>
          <div style={{ color: '#fff', fontSize: 17, fontWeight: 800, lineHeight: 1.3, marginBottom: 14 }}>{ev.title}</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12.5 }}>📅 {ev.date}</span>
            {ev.time && <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12.5 }}>🕐 {ev.time}</span>}
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12.5 }}>📍 {ev.venue}</span>
          </div>
        </div>

        {/* Tear line */}
        <div style={{ position: 'relative', height: 20, background: '#f8fafc', borderTop: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', border: '2px solid #e2e8f0', position: 'absolute', left: -9 }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', border: '2px solid #e2e8f0', position: 'absolute', right: -9 }} />
        </div>

        {/* Ticket body */}
        <div style={{ background: '#f8fafc', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>Registered For</div>
            <div style={{ fontSize: 14.5, color: '#0f172a', fontWeight: 800 }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{user?.email}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>Reference No.</div>
            <div style={{ fontSize: 13, color: '#1a56db', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.5px' }}>{ticketRef}</div>
            <div style={{ marginTop: 6 }}>
              <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>✓ Admitted</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', marginBottom: 22 }}>
        <p style={{ margin: 0, color: '#92400e', fontSize: 13, lineHeight: 1.6 }}>
          📌 Show this reference number <strong>{ticketRef}</strong> at event check-in. A copy has been sent to your email.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{
          flex: 1, background: 'linear-gradient(90deg,#001d5c,#1a56db)', color: '#fff',
          border: 'none', borderRadius: 12, padding: '13px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>Done</button>
      </div>
    </div>
  );
}
