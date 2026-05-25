import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import HaribonFull from '../components/HaribonFull';

export default function MembershipPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyForm, setApplyForm] = useState({ institution: '', campus: '', tier: 'Tier 2' });
  const [applyMsg, setApplyMsg] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.membership.status()
      .then(setStatus)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 32 }}>🦅</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Sign in to view your membership</div>
        <button onClick={() => navigate('/login')}
          style={{ background: 'linear-gradient(90deg,#f97316,#e11d48)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Log in →
        </button>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px 24px', color: '#94a3b8' }}>Loading membership status…</div>;
  }

  const isMember = status?.role === 'MEMBER' || status?.role === 'ADMIN';

  async function handleApply(e) {
    e.preventDefault();
    setApplying(true);
    try {
      const res = await api.membership.apply(applyForm);
      setApplyMsg(res.message);
    } catch (err) {
      setApplyMsg(err.message);
    } finally {
      setApplying(false);
    }
  }

  const dataRows = isMember ? [
    { label: 'Institution',    value: status.institution || user.institution },
    { label: 'Campus',         value: status.campus || user.campus },
    { label: 'Tier',           value: status.tier },
    { label: 'Member Since',   value: status.memberSince },
    { label: 'Renewal Due',    value: status.renewalDue },
    { label: 'Modules Access', value: status.modulesAccess },
  ] : [];

  return (
    <div style={{ background: '#f8fafc', minHeight: '80vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,29,92,0.1)', border: '1px solid #e2e8f0' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#001d5c,#1a56db 55%,#4f46e5)',
            padding: 32, position: 'relative', overflow: 'hidden',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(rgba(249,115,22,0.3),transparent)', right: -40, top: -60, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: isMember ? 'rgba(74,222,128,0.15)' : 'rgba(245,158,11,0.15)',
                border: `1px solid ${isMember ? 'rgba(74,222,128,0.3)' : 'rgba(245,158,11,0.3)'}`,
                borderRadius: 20, padding: '4px 12px', marginBottom: 14,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: isMember ? '#4ade80' : '#fbbf24', display: 'inline-block' }} />
                <span style={{ color: isMember ? '#4ade80' : '#fbbf24', fontSize: 12, fontWeight: 700 }}>{isMember ? 'Valid' : 'Guest'}</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>
                DASIG Membership Status
              </div>
              <div style={{ color: '#fff', fontSize: 28, fontWeight: 900, letterSpacing: '-0.8px' }}>
                {isMember ? 'Active' : 'Guest'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 }}>
                {isMember ? '2026 Membership Year' : 'Apply to become a member'}
              </div>
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <HaribonFull width={80} />
            </div>
          </div>

          {/* Haribon welcome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 24 }}>🦅</div>
            <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.5 }}>
              <strong>Kumusta, {user.name}!</strong>{' '}
              {isMember
                ? 'Your membership is active and all modules are accessible.'
                : 'Your account is active as a guest. Apply below to become a consortium member.'}
            </div>
          </div>

          {isMember ? (
            <>
              <div style={{ padding: '8px 0' }}>
                {dataRows.map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 24px',
                    borderBottom: i < dataRows.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}>
                    <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: 24 }}>
                <button style={{
                  width: '100%', background: 'linear-gradient(90deg,#f97316,#e11d48)',
                  color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14.5, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.42)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >Download Membership Certificate</button>
              </div>
            </>
          ) : (
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: 20, fontSize: 14, color: '#334155', fontWeight: 600 }}>Apply for Institutional Membership</div>
              {applyMsg && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#065f46' }}>
                  {applyMsg}
                </div>
              )}
              <form onSubmit={handleApply}>
                <ApplyField label="Institution" value={applyForm.institution} onChange={e => setApplyForm(f => ({ ...f, institution: e.target.value }))} placeholder="University / Agency name" />
                <ApplyField label="Campus / City" value={applyForm.campus} onChange={e => setApplyForm(f => ({ ...f, campus: e.target.value }))} placeholder="e.g. Cebu City" />
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Membership Tier</label>
                  <select value={applyForm.tier} onChange={e => setApplyForm(f => ({ ...f, tier: e.target.value }))}
                    style={{ width: '100%', padding: '10px 13px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13.5, fontFamily: 'inherit', color: '#0f172a', outline: 'none' }}>
                    <option value="Tier 1">Tier 1 — Full Member</option>
                    <option value="Tier 2">Tier 2 — Associate Member</option>
                    <option value="Tier 3">Tier 3 — Observer</option>
                  </select>
                </div>
                <button type="submit" disabled={applying} style={{
                  width: '100%', background: applying ? '#94a3b8' : 'linear-gradient(90deg,#f97316,#e11d48)',
                  color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14.5, fontWeight: 700,
                  cursor: applying ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}>{applying ? 'Submitting…' : 'Submit Application'}</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ApplyField({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{label}</label>
      <input value={value} onChange={onChange} placeholder={placeholder} required
        style={{ width: '100%', padding: '10px 13px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13.5, fontFamily: 'inherit', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => { e.target.style.borderColor = '#1a56db'; }}
        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
      />
    </div>
  );
}
