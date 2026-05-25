import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const styles = {
  Technology: { iconBg: '#eff6ff', catBg: '#eff6ff', catColor: '#1e40af', accent: 'linear-gradient(135deg,#1a56db,#4f46e5)' },
  Research:   { iconBg: '#ecfdf5', catBg: '#ecfdf5', catColor: '#065f46', accent: 'linear-gradient(135deg,#059669,#0891b2)' },
  Leadership: { iconBg: '#fef9c3', catBg: '#fef9c3', catColor: '#713f12', accent: 'linear-gradient(135deg,#f59e0b,#f97316)' },
  Governance: { iconBg: '#f5f3ff', catBg: '#f5f3ff', catColor: '#4c1d95', accent: 'linear-gradient(135deg,#7c3aed,#1a56db)' },
};

export default function TrainingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.training.list()
      .then(setTrainings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleEnroll(t) {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await api.training.enroll(t.id);
      setTrainings(prev => prev.map(tr => tr.id === t.id ? { ...tr, enrolled: res.enrolled } : tr));
      showToast(`Enrolled in "${t.title}"!`);
    } catch (err) {
      showToast(err.message);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Training Programs" title="Training & Development" />

      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: '#001d5c', color: '#fff', borderRadius: 10, padding: '12px 24px',
          fontSize: 13.5, fontWeight: 600, zIndex: 9000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}>{toast}</div>
      )}

      <section style={{ background: '#f8fafc', padding: '40px 24px 60px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading programs…</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
              {trainings.map(t => (
                <TrainingCard key={t.id} t={{ ...t, ...styles[t.category] }}
                  onEnroll={() => handleEnroll(t)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TrainingCard({ t, onEnroll }) {
  const [hovered, setHovered] = useState(false);
  const pct = Math.round((t.enrolled / t.total) * 100);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 16, padding: 24,
        border: '1px solid #e2e8f0', transition: 'all 0.22s',
        boxShadow: hovered ? '0 8px 28px rgba(0,29,92,0.12)' : 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: t.accent, borderRadius: '2px 0 0 2px' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: t.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
        }}>{t.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span style={{ background: t.catBg, color: t.catColor, borderRadius: 5, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{t.category}</span>
          </div>
          <h3 style={{ fontWeight: 800, fontSize: 15.5, color: '#0f172a', lineHeight: 1.3, marginBottom: 4 }}>{t.title}</h3>
          <div style={{ color: '#64748b', fontSize: 12.5 }}>{t.org}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#64748b' }}>⏱ {t.duration}</div>
        <div style={{ fontSize: 12, color: '#64748b' }}>📊 {t.level}</div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#64748b', marginBottom: 6 }}>
          <span>Enrollment</span><span>{t.enrolled}/{t.total}</span>
        </div>
        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#f97316,#e11d48)', borderRadius: 3 }} />
        </div>
      </div>

      <button onClick={onEnroll}
        disabled={t.enrolled >= t.total}
        style={{
          width: '100%',
          background: t.enrolled >= t.total ? '#e2e8f0' : 'linear-gradient(90deg,#f97316,#e11d48)',
          color: t.enrolled >= t.total ? '#94a3b8' : '#fff',
          border: 'none', borderRadius: 10, padding: '10px', fontSize: 13.5, fontWeight: 700,
          cursor: t.enrolled >= t.total ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { if (t.enrolled < t.total) e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >{t.enrolled >= t.total ? 'Fully Booked' : 'Enroll Now'}</button>
    </div>
  );
}
