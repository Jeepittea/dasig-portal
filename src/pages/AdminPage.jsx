import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const CATEGORIES = ['Summit', 'Workshop', 'Seminar', 'Funding', 'Conference', 'Training'];
const catColors = {
  Summit: '#4f46e5', Workshop: '#0891b2', Seminar: '#7c3aed',
  Funding: '#f59e0b', Conference: '#334155', Training: '#e11d48',
};

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('membership');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'ADMIN') navigate('/');
  }, [user]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 24px 80px' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>

        {/* Page title */}
        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontSize: 11.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6,
            background: 'linear-gradient(90deg,#f97316,#e11d48)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Admin Panel</p>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px', margin: 0 }}>
            Dashboard
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[
            { id: 'membership', label: '👥 Membership' },
            { id: 'events', label: '📅 Events' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                background: tab === t.id ? '#001d5c' : 'transparent',
                color: tab === t.id ? '#fff' : '#64748b',
                transition: 'all 0.15s',
              }}>{t.label}</button>
          ))}
        </div>

        {tab === 'membership' ? <MembershipTab /> : <EventsTab />}
      </div>
    </div>
  );
}

// ── Membership Tab (existing logic) ──────────────────────────────────────────
function MembershipTab() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: '', ok: true });
  const [acting, setActing] = useState(null);

  useEffect(() => {
    api.membership.applications()
      .then(setApplications)
      .catch(() => showToast('Failed to load applications.', false))
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: true }), 3500);
  }

  async function handleApprove(app) {
    setActing(app.id);
    try {
      await api.membership.approve(app.id);
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'APPROVED' } : a));
      showToast(`Approved ${app.name} from ${app.institution}.`);
    } catch (err) { showToast(err.message, false); }
    finally { setActing(null); }
  }

  async function handleReject(app) {
    setActing(app.id);
    try {
      await api.membership.reject(app.id);
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'REJECTED' } : a));
      showToast(`Rejected application from ${app.name}.`, false);
    } catch (err) { showToast(err.message, false); }
    finally { setActing(null); }
  }

  const pending = applications.filter(a => a.status === 'PENDING');
  const resolved = applications.filter(a => a.status !== 'PENDING');

  return (
    <>
      {toast.msg && <Toast msg={toast.msg} ok={toast.ok} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total', value: applications.length, color: '#1a56db', bg: '#eff6ff' },
          { label: 'Pending', value: pending.length, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Resolved', value: resolved.length, color: '#059669', bg: '#ecfdf5' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{s.label} Applications</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading applications…</div>
      ) : applications.length === 0 ? (
        <EmptyState icon="📭" title="No applications yet" sub="Membership applications will appear here once submitted." />
      ) : (
        <>
          {pending.length > 0 && (
            <Section label={`Pending Review (${pending.length})`} color="#f59e0b">
              {pending.map(app => (
                <AppCard key={app.id} app={app} onApprove={() => handleApprove(app)} onReject={() => handleReject(app)} acting={acting === app.id} />
              ))}
            </Section>
          )}
          {resolved.length > 0 && (
            <Section label={`Resolved (${resolved.length})`} color="#94a3b8">
              {resolved.map(app => <AppCard key={app.id} app={app} resolved />)}
            </Section>
          )}
        </>
      )}
    </>
  );
}

// ── Events Tab ────────────────────────────────────────────────────────────────
function EventsTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState({ msg: '', ok: true });

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: true }), 3500);
  }

  useEffect(() => {
    api.events.adminAll()
      .then(setEvents)
      .catch(() => showToast('Failed to load events.', false))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() { setEditing(null); setShowForm(true); }
  function openEdit(ev) { setEditing(ev); setShowForm(true); }

  async function handleSave(formData) {
    try {
      if (editing) {
        const updated = await api.events.update(editing.id, formData);
        setEvents(prev => prev.map(e => e.id === editing.id ? updated : e));
        showToast('Event updated successfully.');
      } else {
        const created = await api.events.create(formData);
        setEvents(prev => [created, ...prev]);
        showToast('Event created and published.');
      }
      setShowForm(false);
    } catch (err) {
      showToast(err.message, false);
    }
  }

  async function handleDelete(ev) {
    if (!window.confirm(`Delete "${ev.title}"? This cannot be undone.`)) return;
    try {
      await api.events.delete(ev.id);
      setEvents(prev => prev.filter(e => e.id !== ev.id));
      showToast('Event deleted.');
    } catch (err) {
      showToast(err.message, false);
    }
  }

  return (
    <>
      {toast.msg && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Stats + Create button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Total', value: events.length, color: '#1a56db', bg: '#eff6ff' },
            { label: 'Published', value: events.filter(e => !e.status || e.status === 'PUBLISHED').length, color: '#059669', bg: '#ecfdf5' },
            { label: 'Draft', value: events.filter(e => e.status === 'DRAFT').length, color: '#f59e0b', bg: '#fffbeb' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={openCreate}
          style={{
            background: 'linear-gradient(90deg,#f97316,#e11d48)', color: '#fff',
            border: 'none', borderRadius: 10, padding: '10px 20px',
            fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 3px 12px rgba(249,115,22,0.35)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >+ Create Event</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading events…</div>
      ) : events.length === 0 ? (
        <EmptyState icon="📅" title="No events yet" sub="Click 'Create Event' to add the first consortium event." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {events.map(ev => (
            <EventAdminCard key={ev.id} ev={ev} onEdit={() => openEdit(ev)} onDelete={() => handleDelete(ev)} />
          ))}
        </div>
      )}

      {showForm && (
        <EventFormModal
          event={editing}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}

function EventAdminCard({ ev, onEdit, onDelete }) {
  const published = !ev.status || ev.status === 'PUBLISHED';
  const catColor = catColors[ev.category] || '#64748b';
  const pct = ev.total > 0 ? Math.round((ev.enrolled / ev.total) * 100) : 0;

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
      {/* Color bar */}
      <div style={{ width: 4, alignSelf: 'stretch', background: catColor, borderRadius: 2, flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ background: catColor + '18', color: catColor, borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>{ev.category}</span>
          <span style={{ background: published ? '#ecfdf5' : '#fffbeb', color: published ? '#059669' : '#b45309', border: `1px solid ${published ? '#a7f3d0' : '#fde68a'}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
            {published ? '● Published' : '○ Draft'}
          </span>
        </div>

        <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 5 }}>{ev.title}</div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: '#64748b', flexWrap: 'wrap', marginBottom: 10 }}>
          <span>📅 {ev.date}{ev.time ? ' · ' + ev.time : ''}</span>
          <span>📍 {ev.venue}</span>
          <span>🏛 {ev.organizer}</span>
        </div>

        {/* Capacity row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, maxWidth: 200 }}>
            <div style={{ height: 5, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#f97316,#e11d48)', borderRadius: 3 }} />
            </div>
          </div>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{ev.enrolled}/{ev.total} seats</span>
          {ev.minAttendance > 0 && <span style={{ fontSize: 11, color: '#94a3b8' }}>Min: {ev.minAttendance}</span>}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={onEdit}
          style={{
            background: '#eff6ff', color: '#1a56db', border: '1px solid #bfdbfe',
            borderRadius: 9, padding: '7px 14px', fontSize: 12.5, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Edit</button>
        <button onClick={onDelete}
          style={{
            background: 'transparent', color: '#e11d48', border: '1.5px solid #fecdd3',
            borderRadius: 9, padding: '7px 14px', fontSize: 12.5, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Delete</button>
      </div>
    </div>
  );
}

function EventFormModal({ event, onSave, onClose }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    category: event?.category || 'Seminar',
    date: event?.date || '',
    time: event?.time || '',
    venue: event?.venue || '',
    organizer: event?.organizer || '',
    maxAttendance: event?.total || 50,
    minAttendance: event?.minAttendance || 0,
    status: event?.status || 'PUBLISHED',
  });
  const [saving, setSaving] = useState(false);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,13,48,0.65)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 18, width: '100%', maxWidth: 580,
        boxShadow: '0 24px 72px rgba(0,0,0,0.35)', overflow: 'hidden',
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Modal header */}
        <div style={{ background: 'linear-gradient(135deg,#001d5c,#1a56db)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ color: '#fff', fontSize: 17, fontWeight: 800 }}>
            {event ? 'Edit Event' : 'Create New Event'}
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          <FormField label="Event Title *" required>
            <input value={form.title} onChange={set('title')} placeholder="e.g. DASIG Annual Summit 2026" required style={inputStyle} />
          </FormField>

          <FormField label="Description">
            <textarea value={form.description} onChange={set('description')} rows={3}
              placeholder="Brief description of the event…"
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Category">
              <select value={form.category} onChange={set('category')} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={set('status')} style={inputStyle}>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Date *" required>
              <input value={form.date} onChange={set('date')} placeholder="e.g. Jun 18–20, 2026" required style={inputStyle} />
            </FormField>
            <FormField label="Time">
              <input value={form.time} onChange={set('time')} placeholder="e.g. 9:00 AM – 5:00 PM" style={inputStyle} />
            </FormField>
          </div>

          <FormField label="Venue *" required>
            <input value={form.venue} onChange={set('venue')} placeholder="e.g. Cebu City Convention Center" required style={inputStyle} />
          </FormField>

          <FormField label="Organizer">
            <input value={form.organizer} onChange={set('organizer')} placeholder="e.g. DASIG Consortium" style={inputStyle} />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Minimum Attendance">
              <input type="number" min="0" value={form.minAttendance} onChange={set('minAttendance')} style={inputStyle} />
            </FormField>
            <FormField label="Maximum Seats">
              <input type="number" min="1" value={form.maxAttendance} onChange={set('maxAttendance')} style={inputStyle} />
            </FormField>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, background: 'transparent', color: '#64748b', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button type="submit" disabled={saving}
              style={{
                flex: 2, background: saving ? '#94a3b8' : 'linear-gradient(90deg,#f97316,#e11d48)',
                color: '#fff', border: 'none', borderRadius: 10, padding: '12px',
                fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}>{saving ? 'Saving…' : event ? 'Save Changes' : 'Create Event'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────

const inputStyle = {
  width: '100%', padding: '10px 13px', borderRadius: 9,
  border: '1.5px solid #e2e8f0', fontSize: 13.5, fontFamily: 'inherit',
  color: '#0f172a', outline: 'none', boxSizing: 'border-box',
  background: '#fff',
};

function FormField({ label, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#e11d48' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Section({ label, color, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>{children}</div>
    </div>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{title}</div>
      <div style={{ color: '#94a3b8', fontSize: 13.5 }}>{sub}</div>
    </div>
  );
}

function Toast({ msg, ok }) {
  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      background: ok ? '#001d5c' : '#e11d48', color: '#fff', borderRadius: 10,
      padding: '12px 24px', fontSize: 13.5, fontWeight: 600, zIndex: 9000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)', whiteSpace: 'nowrap',
    }}>{msg}</div>
  );
}

function AppCard({ app, onApprove, onReject, acting, resolved }) {
  const sc = {
    PENDING:  { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b', label: 'Pending' },
    APPROVED: { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0', dot: '#10b981', label: 'Approved' },
    REJECTED: { bg: '#fff1f2', color: '#9f1239', border: '#fecdd3', dot: '#f43f5e', label: 'Rejected' },
  }[app.status] || { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b', label: 'Pending' };

  const date = new Date(app.applied_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 18, opacity: resolved ? 0.72 : 1 }}>
      <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: 'linear-gradient(135deg,#001d5c,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>
        {app.name?.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', marginBottom: 3 }}>{app.name}</div>
        <div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 5 }}>{app.email} · {app.institution}{app.campus ? `, ${app.campus}` : ''}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ background: '#eff6ff', color: '#1e40af', borderRadius: 5, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>{app.tier || 'Tier 2'}</span>
          <span style={{ color: '#94a3b8', fontSize: 11.5 }}>Applied {date}</span>
        </div>
      </div>
      <div style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
        {sc.label}
      </div>
      {!resolved && (
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={onApprove} disabled={acting}
            style={{ background: acting ? '#e2e8f0' : 'linear-gradient(90deg,#059669,#0891b2)', color: acting ? '#94a3b8' : '#fff', border: 'none', borderRadius: 9, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: acting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {acting ? '…' : 'Approve'}
          </button>
          <button onClick={onReject} disabled={acting}
            style={{ background: 'transparent', color: '#e11d48', border: '1.5px solid #fecdd3', borderRadius: 9, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: acting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
