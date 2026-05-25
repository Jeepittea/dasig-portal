import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../api';

const memberStyles = {
  UP:    { iconBg: '#eff6ff', iconColor: '#1e40af' },
  USa:   { iconBg: '#fef9c3', iconColor: '#713f12' },
  DOST:  { iconBg: '#ecfdf5', iconColor: '#065f46' },
  DICT:  { iconBg: '#f5f3ff', iconColor: '#4c1d95' },
  DTI:   { iconBg: '#fff1f2', iconColor: '#9f1239' },
  DepEd: { iconBg: '#ecfeff', iconColor: '#155e75' },
};

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.members.list()
      .then(setMembers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Consortium Members" title="Region VII Institutions" />
      <section style={{ background: '#f8fafc', padding: '40px 24px 60px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading members…</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              {members.map(m => <MemberCard key={m.id} member={{ ...m, ...memberStyles[m.abbr] }} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MemberCard({ member: m }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 16, padding: 24,
        border: '1px solid #e2e8f0', transition: 'all 0.22s', cursor: 'pointer',
        boxShadow: hovered ? '0 8px 28px rgba(0,29,92,0.12)' : 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: m.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: 15, color: m.iconColor, marginBottom: 14, letterSpacing: '-0.5px',
      }}>{m.abbr}</div>
      <div style={{ fontWeight: 800, fontSize: 22, color: m.iconColor, marginBottom: 4 }}>{m.abbr}</div>
      <div style={{ fontWeight: 600, fontSize: 13.5, color: '#0f172a', marginBottom: 6, lineHeight: 1.4 }}>{m.full_name}</div>
      <div style={{ color: '#64748b', fontSize: 12.5, marginBottom: 12 }}>📍 {m.campus}</div>
      <span style={{ background: m.iconBg, color: m.iconColor, borderRadius: 6, padding: '4px 12px', fontSize: 11.5, fontWeight: 700 }}>{m.type}</span>
    </div>
  );
}
