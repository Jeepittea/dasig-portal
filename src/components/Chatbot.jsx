import { useState, useRef, useEffect } from 'react';
import HaribonFace from './HaribonFace';
import { api } from '../api';

const initialMessages = [
  { from: 'bot', text: "Kumusta! I'm Haribon 🦅, your DASIG AI Assistant. Ask me about events, funding, membership or training!" }
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, thinking]);

  async function sendMsg() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text }]);
    setThinking(true);
    try {
      const res = await api.chatbot.send(text);
      setMessages(prev => [...prev, { from: 'bot', text: res.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, I could not connect to the DASIG knowledge base right now. Please try again.' }]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', bottom: 86, right: 22, width: 316,
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
          zIndex: 9998, border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#001d5c,#1a56db 55%,#4f46e5)',
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(rgba(249,115,22,0.3),transparent)', right: -20, top: -20, pointerEvents: 'none' }} />
            <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
              <HaribonFace size={36} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13.5, position: 'relative' }}>Haribon · DASIG AI</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, marginTop: 1, position: 'relative' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Online · NLP-powered
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={msgsRef} style={{ height: 210, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 8, background: '#fff' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '86%', padding: '8px 12px', borderRadius: 12, fontSize: 12.5, lineHeight: 1.5,
                  ...(msg.from === 'bot'
                    ? { background: '#f8fafc', color: '#334155', borderBottomLeftRadius: 4, border: '1px solid #e2e8f0' }
                    : { background: 'linear-gradient(135deg,#001d5c,#1a56db)', color: '#fff', borderBottomRightRadius: 4 }
                  ),
                }}>{msg.text}</div>
              </div>
            ))}
            {thinking && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, borderBottomLeftRadius: 4, padding: '8px 14px', fontSize: 18, color: '#94a3b8', letterSpacing: 2 }}>
                  ···
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !thinking && sendMsg()}
              placeholder="Ask Haribon anything…"
              style={{
                flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: 9, padding: '8px 12px', fontSize: 12.5,
                color: '#0f172a', fontFamily: 'inherit', outline: 'none',
              }}
            />
            <button onClick={sendMsg} disabled={thinking}
              style={{
                background: thinking ? '#e2e8f0' : 'linear-gradient(90deg,#f97316,#e11d48)',
                color: thinking ? '#94a3b8' : '#fff', border: 'none', borderRadius: 9,
                padding: '8px 14px', fontSize: 13, fontWeight: 700,
                cursor: thinking ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}
            >→</button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(o => !o)} title="Chat with Haribon"
        style={{
          position: 'fixed', bottom: 22, right: 22,
          width: 54, height: 54, borderRadius: '50%',
          border: 'none', cursor: 'pointer', zIndex: 9999,
          overflow: 'hidden', boxShadow: '0 4px 20px rgba(249,115,22,0.42)',
          padding: 0, background: 'transparent', transition: 'all 0.22s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {open ? (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#001d5c,#1a56db 55%,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 700 }}>✕</div>
        ) : (
          <HaribonFace size={54} style={{ borderRadius: '50%' }} />
        )}
      </button>
    </>
  );
}
