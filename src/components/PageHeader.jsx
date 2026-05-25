import HaribonFull from './HaribonFull';

export default function PageHeader({ eyebrow, title }) {
  return (
    <section style={{
      background: 'linear-gradient(135deg,#000d30 0%,#001d5c 50%,#1a3878 100%)',
      padding: '40px 24px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(rgba(79,70,229,0.2),transparent 70%)',
        top: -100, right: 0, pointerEvents: 'none',
      }} />
      <div style={{
        maxWidth: 1120, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 120px',
        gap: 24, alignItems: 'flex-end', position: 'relative', zIndex: 1,
      }}>
        <div style={{ paddingBottom: 32 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: 8, color: 'rgba(255,255,255,0.5)',
          }}>{eyebrow}</p>
          <h1 style={{
            color: '#fff', fontSize: 38, fontWeight: 900,
            lineHeight: 1.1, letterSpacing: '-1.2px', margin: 0,
          }}>{title}</h1>
        </div>
        <HaribonFull width={90} style={{ alignSelf: 'flex-end' }} />
      </div>
    </section>
  );
}
