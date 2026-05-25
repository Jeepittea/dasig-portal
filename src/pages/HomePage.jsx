import { useNavigate } from 'react-router-dom';
import HaribonFull from '../components/HaribonFull';

const modules = [
  { title: 'Membership', desc: 'Tier-based institutional membership, renewals & status tracking.', icon: '👥', accent: 'linear-gradient(135deg,#1a56db,#4f46e5)', iconBg: '#eff6ff' },
  { title: 'Events', desc: 'Workshop & summit discovery, registration and reporting.', icon: '📅', accent: 'linear-gradient(135deg,#0891b2,#059669)', iconBg: '#ecfeff' },
  { title: 'News', desc: 'Consortium announcements and publications archive.', icon: '📰', accent: 'linear-gradient(135deg,#7c3aed,#ec4899)', iconBg: '#f5f3ff' },
  { title: 'Policies', desc: 'Governance documents and official consortium guidelines.', icon: '📋', accent: 'linear-gradient(135deg,#f59e0b,#f97316)', iconBg: '#fffbeb' },
  { title: 'Funding', desc: 'Government grants and scholarship opportunities board.', icon: '💰', accent: 'linear-gradient(135deg,#059669,#0891b2)', iconBg: '#ecfdf5' },
  { title: 'Training', desc: 'Technical & leadership training enrollment programs.', icon: '🎓', accent: 'linear-gradient(135deg,#e11d48,#f97316)', iconBg: '#fff1f2' },
  { title: 'Partnerships', desc: 'Academic, government and industry partnership explorer.', icon: '🤝', accent: 'linear-gradient(135deg,#0891b2,#4f46e5)', iconBg: '#ecfeff' },
  { title: 'AI Chatbot', desc: 'Ask Haribon anything about DASIG services!', icon: '🤖', accent: 'linear-gradient(135deg,#7c3aed,#1a56db)', iconBg: '#f5f3ff' },
  { title: 'SSO / OAuth', desc: 'Single sign-on across all consortium sub-systems.', icon: '🔐', accent: 'linear-gradient(135deg,#e11d48,#7c3aed)', iconBg: '#fff1f2' },
];

function ModuleCard({ mod }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? 'transparent' : '#e2e8f0'}`,
        borderRadius: 14,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.22s',
        cursor: 'pointer',
        boxShadow: hovered ? '0 8px 28px rgba(0,29,92,0.12)' : 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        background: mod.accent, borderRadius: '2px 0 0 2px',
      }} />
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: mod.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, marginBottom: 13,
      }}>{mod.icon}</div>
      <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 5 }}>{mod.title}</div>
      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{mod.desc}</div>
    </div>
  );
}

import { useState } from 'react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg,#000d30 0%,#001d5c 50%,#1a3878 100%)',
        padding: '0 24px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 530,
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />
        {/* Glow 1 */}
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(rgba(79,70,229,0.2),transparent 70%)',
          top: -200, right: -60, pointerEvents: 'none',
        }} />
        {/* Glow 2 */}
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(rgba(249,115,22,0.14),transparent 70%)',
          bottom: -60, left: 60, pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1120, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 300px',
          gap: 40, alignItems: 'flex-end',
          padding: '64px 0 0', position: 'relative', zIndex: 1,
        }}>
          <div>
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 24, padding: '5px 14px 5px 5px', marginBottom: 20,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 11,
                background: 'linear-gradient(90deg,#f97316,#e11d48)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
              }}>🏛</div>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.5px' }}>
                CENTRAL VISAYAS CONSORTIUM · REGION VII · 6 INSTITUTIONS
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              color: '#fff', fontSize: 50, fontWeight: 900,
              lineHeight: 1.07, letterSpacing: '-2px', marginBottom: 18,
            }}>
              The Smarter Way to{' '}
              <span style={{
                background: 'linear-gradient(90deg,#f97316,#e11d48)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Run Your Consortium</span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 15.5, lineHeight: 1.75, marginBottom: 32, maxWidth: 500 }}>
              DASIG unifies membership, events, funding, training, and governance for UP, USan Agustin, DOST, DICT, DTI, and DepEd Region VII — all in one secure, role-based platform.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
              <button
                onClick={() => navigate('/membership')}
                style={{
                  background: 'linear-gradient(90deg,#f97316,#e11d48)',
                  color: '#fff', border: 'none', borderRadius: 10,
                  padding: '13px 26px', fontSize: 14.5, fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 4px 20px rgba(249,115,22,0.42)',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >Get Started Free →</button>
              <button style={{
                color: 'rgba(255,255,255,0.82)',
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: 10, padding: '13px 26px', fontSize: 14.5,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              >View all modules</button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.09)', paddingTop: 26 }}>
              {[
                { v: '6', l: 'Institutions' },
                { v: '120+', l: 'Events' },
                { v: '₱12M+', l: 'Funding' },
                { v: '48', l: 'Partners' },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1,
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.09)' : 'none',
                  padding: i === 0 ? '0 20px 0 0' : '0 20px',
                }}>
                  <div style={{
                    fontSize: 30, fontWeight: 900, letterSpacing: '-1px',
                    background: 'linear-gradient(90deg,#f97316,#e11d48)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>{s.v}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Haribon Full */}
          <HaribonFull width={280} />
        </div>
      </section>

      {/* MEMBER STRIP */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{
          maxWidth: 1120, margin: '0 auto', height: 50,
          display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden',
        }}>
          <span style={{ color: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Region VII Members
          </span>
          <div style={{ width: 1, height: 14, background: '#e2e8f0', flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {['University of the Philippines', 'University of San Agustin', 'DOST Region VII', 'DICT Region VII', 'DTI Region VII', 'DepEd Region VII'].map(m => (
              <div key={m} style={{
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6,
                padding: '4px 11px', fontSize: 11.5, color: '#334155', fontWeight: 500, whiteSpace: 'nowrap',
              }}>{m}</div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURE HIGHLIGHTS */}
      <section style={{ background: '#fff', padding: '52px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {[
            {
              icon: '🦅', title: 'Powered by Haribon AI',
              desc: 'Our NLP chatbot handles consortium queries with 80%+ accuracy — scoped to DASIG knowledge. Ask Haribon anything about events, funding, or membership.',
              bg: 'linear-gradient(135deg,#000d30,#001d5c)', borderColor: '#1a3878',
              iconBg: 'linear-gradient(135deg,rgba(249,115,22,0.2),rgba(225,29,72,0.15))',
              titleColor: '#fff', textColor: 'rgba(255,255,255,0.58)',
            },
            {
              icon: '🏛', title: 'Built for six Region VII institutions',
              desc: 'One platform connecting UP, USan Agustin, DOST, DICT, DTI, and DepEd — all Region VII — with role-based access for every stakeholder.',
              bg: 'linear-gradient(135deg,#0d1445,#1a3878)', borderColor: '#2a4a9e',
              iconBg: 'linear-gradient(135deg,rgba(79,70,229,0.2),rgba(125,211,252,0.1))',
              titleColor: '#fff', textColor: 'rgba(255,255,255,0.58)',
            },
            {
              icon: '🔐', title: 'Enterprise-grade security',
              desc: 'OAuth 2.0 RFC 6749, JWT authentication, and RBAC middleware — every access point is verified, auditable, and secure.',
              bg: 'linear-gradient(135deg,rgba(249,115,22,0.1),rgba(225,29,72,0.06))', borderColor: 'rgba(249,115,22,0.2)',
              iconBg: 'linear-gradient(135deg,rgba(249,115,22,0.12),rgba(245,158,11,0.08))',
              titleColor: '#0f172a', textColor: '#64748b',
            },
          ].map((f, i) => (
            <div key={i} style={{
              background: f.bg, borderRadius: 16, padding: 26,
              position: 'relative', overflow: 'hidden',
              border: `1px solid ${f.borderColor}`,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13,
                background: f.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 21, marginBottom: 16,
              }}>{f.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 7, letterSpacing: '-0.3px', color: f.titleColor }}>{f.title}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.65, color: f.textColor }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section style={{ background: '#f8fafc', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <p style={{
            fontSize: 11.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: 7,
            background: 'linear-gradient(90deg,#f97316,#e11d48)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Platform Modules</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 8 }}>
            Everything your consortium needs
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.65, maxWidth: 520, marginBottom: 36 }}>
            Nine integrated modules — unified under one secure, role-based platform built on clean architecture.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 13 }}>
            {modules.map(mod => <ModuleCard key={mod.title} mod={mod} />)}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section style={{ background: '#fff', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <p style={{
                fontSize: 11.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                marginBottom: 7,
                background: 'linear-gradient(90deg,#f97316,#e11d48)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Consortium News</p>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px' }}>Stay informed</h2>
            </div>
            <button
              onClick={() => navigate('/news')}
              style={{ color: '#1a56db', background: 'transparent', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >All news →</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: 16 }}>
            {/* Featured */}
            <NewsFeatureCard navigate={navigate} />
            {/* Mini articles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <MiniNewsCard
                icon="📋" iconBg="#fef9c3" badgeBg="#fef9c3" badgeColor="#713f12" badge="Policy"
                date="May 14, 2026"
                title="Updated Membership Renewal Guidelines for AY 2026–2027"
                excerpt="Revised criteria now available for institutional review."
              />
              <MiniNewsCard
                icon="💰" iconBg="#dcfce7" badgeBg="#dcfce7" badgeColor="#14532d" badge="Funding"
                date="May 8, 2026"
                title="DOST Region VII Scholarship Window Now Open"
                excerpt="Apply via the Funding portal before June 15."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#f8fafc', padding: '60px 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg,#001d5c,#1a56db 55%,#4f46e5)',
          borderRadius: 18, overflow: 'hidden', position: 'relative',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          maxWidth: 1120, margin: '0 auto',
        }}>
          <div style={{
            position: 'absolute', width: 380, height: 380, borderRadius: '50%',
            background: 'radial-gradient(rgba(79,70,229,0.3),transparent 70%)',
            right: -80, top: -100, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(rgba(249,115,22,0.2),transparent 70%)',
            left: -40, bottom: -60, pointerEvents: 'none',
          }} />

          <div style={{ padding: 48, position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '1px', marginBottom: 10, textTransform: 'uppercase' }}>
              Join Region VII Consortium
            </p>
            <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 13 }}>
              Ready to connect your institution?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>
              Register and unlock all nine modules, events, funding, and governance tools. Free to start.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => navigate('/membership')}
                style={{
                  background: 'linear-gradient(90deg,#f97316,#e11d48)',
                  color: '#fff', border: 'none', borderRadius: 10,
                  padding: '11px 22px', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >Apply for Membership</button>
              <button style={{
                color: 'rgba(255,255,255,0.82)',
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: 10, padding: '11px 22px', fontSize: 14,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Learn more</button>
            </div>
          </div>

          <div style={{
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            padding: 36, display: 'flex', flexDirection: 'column',
            gap: 10, justifyContent: 'center', position: 'relative', zIndex: 1,
          }}>
            {[
              { icon: '🦅', title: 'Ask Haribon', sub: 'NLP AI chatbot, 80%+ accuracy' },
              { icon: '🔒', title: 'Role-Based Access', sub: 'GUEST · MEMBER · ADMIN' },
              { icon: '📊', title: 'Live Analytics', sub: 'Real-time dashboards' },
              { icon: '🌐', title: 'OAuth 2.0 SSO', sub: 'RFC 6749 compliant' },
            ].map(f => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 11, padding: '13px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0,
                }}>{f.icon}</div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: 13, fontWeight: 600 }}>{f.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11.5, marginTop: 2 }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function NewsFeatureCard({ navigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer',
        transition: 'all 0.22s',
        boxShadow: hovered ? '0 8px 28px rgba(0,29,92,0.1)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div style={{
        height: 210, position: 'relative',
        background: 'linear-gradient(135deg,#001d5c,#1a56db 55%,#4f46e5)',
        display: 'flex', alignItems: 'flex-end', padding: 22,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{
            background: 'rgba(255,255,255,0.15)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 5, padding: '3px 9px', fontSize: 10.5, fontWeight: 700,
            display: 'block', width: 'fit-content', marginBottom: 7,
          }}>📣 Announcement</span>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5, marginBottom: 4 }}>May 20, 2026</div>
          <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 19, lineHeight: 1.22, maxWidth: 360, letterSpacing: '-0.3px' }}>
            DASIG Annual Summit 2026 Registration Now Open
          </h3>
        </div>
      </div>
      <div style={{ padding: 22 }}>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.75, marginBottom: 16 }}>
          The annual summit gathers all six Region VII consortium institutions for a three-day innovation forum, research showcase, and networking event in Cebu City.
        </p>
        <button
          onClick={() => navigate('/news')}
          style={{
            background: 'linear-gradient(90deg,#f97316,#e11d48)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '8px 16px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >Read more →</button>
      </div>
    </div>
  );
}

function MiniNewsCard({ icon, iconBg, badgeBg, badgeColor, badge, date, title, excerpt }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', border: `1px solid ${hovered ? '#93c5fd' : '#e2e8f0'}`,
        borderRadius: 13, padding: 15, display: 'flex', gap: 11,
        cursor: 'pointer', transition: 'all 0.2s',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <span style={{ background: badgeBg, color: badgeColor, borderRadius: 5, padding: '3px 9px', fontSize: 10.5, fontWeight: 700 }}>{badge}</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{date}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a', lineHeight: 1.35, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55 }}>{excerpt}</div>
      </div>
    </div>
  );
}
