import SunSeal from './SunSeal';

export default function Footer() {
  return (
    <>
      <div style={{ height: 3, background: 'linear-gradient(90deg,#f97316,#e11d48)' }} />
      <footer style={{ background: '#020817', padding: '48px 24px 26px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1fr 1fr 1fr',
            gap: 32,
            marginBottom: 36,
          }}>
            {/* Col 1 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <SunSeal size={24} />
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>DASIG Portal</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12.5, lineHeight: 1.75, margin: '10px 0 16px' }}>
                Dynamic Alliance for Science, Innovation &amp; Governance — Central Visayas, Region VII. Connecting six institutions for a smarter, more coordinated region.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['📧', '📘', '🐦'].map((icon, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, cursor: 'pointer',
                  }}>{icon}</div>
                ))}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.5px', marginBottom: 12, textTransform: 'uppercase' }}>Modules</div>
              {['Events', 'News', 'Policies', 'Funding', 'Training', 'AI Chatbot'].map(l => (
                <a key={l} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12.5, display: 'block', marginBottom: 7, cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >{l}</a>
              ))}
            </div>

            {/* Col 3 */}
            <div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.5px', marginBottom: 12, textTransform: 'uppercase' }}>Region VII Members</div>
              {['UP Visayas', 'USan Agustin', 'DOST VII', 'DICT VII', 'DTI VII', 'DepEd VII'].map(l => (
                <a key={l} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12.5, display: 'block', marginBottom: 7, cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >{l}</a>
              ))}
            </div>

            {/* Col 4 */}
            <div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.5px', marginBottom: 12, textTransform: 'uppercase' }}>Support</div>
              {['Help Center', 'Contact Admin', 'Report Issue', 'Privacy Policy', 'Terms of Use'].map(l => (
                <a key={l} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12.5, display: 'block', marginBottom: 7, cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >{l}</a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.27)', fontSize: 11.5 }}>© 2026 DASIG Consortium · Region VII, Central Visayas, Philippines</span>
            <span style={{ color: 'rgba(255,255,255,0.27)', fontSize: 11.5 }}>Team 40 · CIT-U IT332 Capstone &amp; Research 1</span>
          </div>
        </div>
      </footer>
    </>
  );
}
