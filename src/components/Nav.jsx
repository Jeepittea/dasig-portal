import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SunSeal from './SunSeal';
import HaribonFace from './HaribonFace';

const navLinks = [
  { label: 'Events',   to: '/events'     },
  { label: 'News',     to: '/news'       },
  { label: 'Training', to: '/training'   },
  { label: 'Members',  to: '/members'    },
];

const roleColors = {
  ADMIN:  { bg: 'rgba(225,29,72,0.18)',  color: '#f43f5e', text: 'Admin'  },
  MEMBER: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', text: 'Member' },
  GUEST:  { bg: 'rgba(255,255,255,0.08)',color: 'rgba(255,255,255,0.5)', text: 'Guest' },
};

export default function Nav() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav style={{
      background: 'rgba(0,13,48,0.96)',
      backdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 999,
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '0 24px',
        height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <SunSeal size={32} />
          <HaribonFace size={28} />
          <div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px' }}>DASIG</span>
            <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, fontWeight: 400 }}> Portal</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 2 }}>
          {navLinks.map(link => (
            <button key={link.label} onClick={() => navigate(link.to)}
              style={{
                background: 'transparent', color: 'rgba(255,255,255,0.65)',
                border: 'none', borderRadius: 7, padding: '6px 13px',
                fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent'; }}
            >{link.label}</button>
          ))}
        </div>

        {/* Auth area */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {user ? (
            <>
              {/* Role badge */}
              <div style={{
                background: roleColors[user.role]?.bg,
                border: `1px solid ${roleColors[user.role]?.color}40`,
                borderRadius: 20, padding: '3px 10px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: roleColors[user.role]?.color, display: 'inline-block' }} />
                <span style={{ color: roleColors[user.role]?.color, fontSize: 11, fontWeight: 700 }}>{roleColors[user.role]?.text}</span>
              </div>
              {/* Name */}
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </span>
              {/* Membership card for members */}
              {(user.role === 'MEMBER' || user.role === 'ADMIN') && (
                <button onClick={() => navigate('/membership')}
                  style={{
                    color: 'rgba(255,255,255,0.65)', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
                    padding: '5px 13px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >My Card</button>
              )}
              {/* Admin dashboard link */}
              {user.role === 'ADMIN' && (
                <button onClick={() => navigate('/admin')}
                  style={{
                    color: '#f97316', background: 'rgba(249,115,22,0.12)',
                    border: '1px solid rgba(249,115,22,0.3)', borderRadius: 8,
                    padding: '5px 13px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >Admin</button>
              )}
              {/* Logout */}
              <button onClick={handleLogout}
                style={{
                  color: 'rgba(255,255,255,0.65)', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                  padding: '6px 13px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                }}>Log out</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}
                style={{
                  color: 'rgba(255,255,255,0.75)', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.22)', borderRadius: 8,
                  padding: '6px 15px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                }}>Log in</button>
              <button onClick={() => navigate('/login')}
                style={{
                  background: 'linear-gradient(90deg,#f97316,#e11d48)', color: '#fff',
                  border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 2px 12px rgba(249,115,22,0.35)',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >Register free →</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
