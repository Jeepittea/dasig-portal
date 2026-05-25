import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: '', ok: true });
  const [acting, setActing] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'ADMIN') { navigate('/'); return; }
    api.membership.applications()
      .then(setApplications)
      .catch(() => showToast('Failed to load applications.', false))
      .finally(() => setLoading(false));
  }, [user]);

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
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setActing(null);
    }
  }

  async function handleReject(app) {
    setActing(app.id);
    try {
      await api.membership.reject(app.id);
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'REJECTED' } : a));
      showToast(`Rejected application from ${app.name}.`, false);
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setActing(null);
    }
  }

  const pending  = applications.filter(a => a.status === 'PENDING');
  const resolved = applications.filter(a => a.status !== 'PENDING');

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 24px 80px' }}>

      {toast.msg && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: toast.ok ? '#001d5c' : '#e11d48',
          color: '#fff', borderRadius: 10, padding: '12px 24px',
          fontSize: 13.5, fontWeight: 600, zIndex: 9000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}>{toast.msg}</div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontSize: 11.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6,
            background: 'linear-gradient(90deg,#f97316,#e11d48)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Admin Panel</p>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 6 }}>
            Membership Applications
          </h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Review and approve or reject institutional membership requests.
          </p>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'Total',    value: applications.length, color: '#1a56db', bg: '#eff6ff' },
            { label: 'Pending',  value: pending.length,      color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Resolved', value: resolved.length,     color: '#059669', bg: '#ecfdf5' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
              padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: s.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 900, color: s.color,
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{s.label} Applications</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading applications…</div>
        ) : applications.length === 0 ? (
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
            padding: '60px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>No applications yet</div>
            <div style={{ color: '#94a3b8', fontSize: 13.5 }}>Membership applications will appear here once submitted.</div>
          </div>
        ) : (
          <>
            {/* Pending */}
            {pending.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>
                  Pending Review ({pending.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {pending.map(app => (
                    <AppCard
                      key={app.id} app={app}
                      onApprove={() => handleApprove(app)}
                      onReject={() => handleReject(app)}
                      acting={acting === app.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Resolved */}
            {resolved.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>
                  Resolved ({resolved.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {resolved.map(app => (
                    <AppCard key={app.id} app={app} resolved />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AppCard({ app, onApprove, onReject, acting, resolved }) {
  const statusConfig = {
    PENDING:  { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b', label: 'Pending'  },
    APPROVED: { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0', dot: '#10b981', label: 'Approved' },
    REJECTED: { bg: '#fff1f2', color: '#9f1239', border: '#fecdd3', dot: '#f43f5e', label: 'Rejected' },
  };
  const sc = statusConfig[app.status] || statusConfig.PENDING;
  const date = new Date(app.applied_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
      padding: 22, display: 'flex', alignItems: 'center', gap: 20,
      opacity: resolved ? 0.72 : 1,
    }}>
      {/* Avatar */}
      <div style={{
        width: 48, height: 48, borderRadius: 13, flexShrink: 0,
        background: 'linear-gradient(135deg,#001d5c,#4f46e5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: 18,
      }}>
        {app.name?.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 3 }}>{app.name}</div>
        <div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 6 }}>
          {app.email} · {app.institution}{app.campus ? `, ${app.campus}` : ''}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: '#eff6ff', color: '#1e40af', borderRadius: 5, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>
            {app.tier || 'Tier 2'}
          </span>
          <span style={{ color: '#94a3b8', fontSize: 11.5 }}>Applied {date}</span>
        </div>
      </div>

      {/* Status badge */}
      <div style={{
        background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
        borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
        {sc.label}
      </div>

      {/* Actions */}
      {!resolved && (
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={onApprove} disabled={acting}
            style={{
              background: acting ? '#e2e8f0' : 'linear-gradient(90deg,#059669,#0891b2)',
              color: acting ? '#94a3b8' : '#fff',
              border: 'none', borderRadius: 9, padding: '8px 16px',
              fontSize: 13, fontWeight: 700, cursor: acting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!acting) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >{acting ? '…' : 'Approve'}</button>
          <button
            onClick={onReject} disabled={acting}
            style={{
              background: 'transparent', color: '#e11d48',
              border: '1.5px solid #fecdd3', borderRadius: 9, padding: '8px 16px',
              fontSize: 13, fontWeight: 700, cursor: acting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!acting) { e.currentTarget.style.background = '#fff1f2'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >Reject</button>
        </div>
      )}
    </div>
  );
}
