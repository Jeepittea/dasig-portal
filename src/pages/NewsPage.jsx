import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../api';

const iconBgs = {
  Announcement: 'linear-gradient(135deg,#001d5c,#4f46e5)',
  Policy:   '#fef9c3',
  Funding:  '#dcfce7',
  Training: '#fff1f2',
};
const badgeStyles = {
  Announcement: { bg: '#eff6ff', color: '#1e40af' },
  Policy:       { bg: '#fef9c3', color: '#713f12' },
  Funding:      { bg: '#dcfce7', color: '#14532d' },
  Training:     { bg: '#fff1f2', color: '#9f1239' },
};

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.news.list()
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Consortium News" title="News & Announcements" />
      <section style={{ background: '#f8fafc', padding: '40px 24px 60px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading news…</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {articles.map(a => <NewsRow key={a.id} article={a} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function NewsRow({ article: a }) {
  const [hovered, setHovered] = useState(false);
  const badge = badgeStyles[a.badge] || badgeStyles.Announcement;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', border: `1px solid ${hovered ? '#93c5fd' : '#e2e8f0'}`,
        borderRadius: 14, padding: 20, display: 'flex', gap: 16,
        cursor: 'pointer', transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 4px 16px rgba(0,29,92,0.08)' : 'none',
        opacity: a.locked ? 0.7 : 1,
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
        background: iconBgs[a.badge] || iconBgs.Announcement,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
      }}>{a.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ background: badge.bg, color: badge.color, borderRadius: 5, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{a.badge}</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{a.date}</span>
          {a.locked && <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 5, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>🔒 Members Only</span>}
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 15.5, color: '#0f172a', lineHeight: 1.35, marginBottom: 6 }}>{a.title}</h3>
        <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65 }}>{a.excerpt}</p>
      </div>
      <div style={{ alignSelf: 'center', color: '#94a3b8', fontSize: 18 }}>→</div>
    </div>
  );
}
