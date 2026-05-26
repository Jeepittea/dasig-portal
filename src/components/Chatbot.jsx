import { useState, useRef, useEffect } from 'react';
import HaribonFace from './HaribonFace';
import { api } from '../api';

const WELCOME = {
  from: 'bot',
  html: `Kumusta! I'm <strong>Haribon 🦅</strong>, your DASIG AI Assistant.<br><br>I can help you with events, membership, funding, training, news, and more. What would you like to know?`,
  intent: 'greeting',
  quickReplies: ['Upcoming events?', 'How to apply for membership?', 'Available training programs?'],
  ts: new Date(),
};

function fmt(date) {
  return date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const msgsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, thinking, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  async function sendMsg(text) {
    const msg = (text || input).trim();
    if (!msg || thinking) return;
    setInput('');

    setMessages(prev => [...prev, { from: 'user', text: msg, ts: new Date() }]);
    setThinking(true);

    try {
      const res = await api.chatbot.send(msg);
      setMessages(prev => [...prev, {
        from: 'bot',
        html: res.reply,
        intent: res.intent,
        quickReplies: res.quickReplies || [],
        ts: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        from: 'bot',
        html: 'Sorry, I could not connect to the DASIG knowledge base. Please try again.',
        intent: 'error',
        quickReplies: [],
        ts: new Date(),
      }]);
    } finally {
      setThinking(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
  }

  function clearChat() {
    setMessages([{ ...WELCOME, ts: new Date() }]);
  }

  const lastMsg = messages[messages.length - 1];
  const showQuickReplies = !thinking && lastMsg?.from === 'bot' && lastMsg?.quickReplies?.length > 0;

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 22, width: 360,
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          zIndex: 9998, border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 540,
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#000d30,#001d5c 55%,#1a3878)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            flexShrink: 0,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              <HaribonFace size={38} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>Haribon · DASIG AI</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                DASIG-scoped · NLP Assistant
              </div>
            </div>
            <button onClick={clearChat} title="Clear chat"
              style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.6)', borderRadius: 7, padding: '4px 8px',
                fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', marginRight: 4,
              }}>Clear</button>
            <button onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)', borderRadius: 7, width: 26, height: 26,
                cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'inherit',
              }}>✕</button>
          </div>

          {/* Messages */}
          <div ref={msgsRef} style={{
            flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
            display: 'flex', flexDirection: 'column', gap: 10,
            background: '#fff',
          }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 6 }}>
                  {msg.from === 'bot' && (
                    <div style={{ width: 26, height: 26, borderRadius: 8, overflow: 'hidden', flexShrink: 0, marginBottom: 2 }}>
                      <HaribonFace size={26} />
                    </div>
                  )}
                  <div style={{ maxWidth: '82%' }}>
                    <div style={{
                      padding: '9px 13px', borderRadius: 14, fontSize: 12.5, lineHeight: 1.6,
                      ...(msg.from === 'bot' ? {
                        background: msg.intent === 'out_of_scope' ? '#fff7ed' : '#f8fafc',
                        color: '#334155',
                        borderBottomLeftRadius: 4,
                        border: msg.intent === 'out_of_scope' ? '1px solid #fed7aa' : '1px solid #e2e8f0',
                      } : {
                        background: 'linear-gradient(135deg,#001d5c,#1a56db)',
                        color: '#fff',
                        borderBottomRightRadius: 4,
                      }),
                    }}>
                      {msg.from === 'bot' && msg.html
                        ? <span dangerouslySetInnerHTML={{ __html: msg.html }} />
                        : msg.text
                      }
                    </div>
                    <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 3, textAlign: msg.from === 'user' ? 'right' : 'left', paddingLeft: 4 }}>
                      {fmt(msg.ts)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {thinking && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <HaribonFace size={26} />
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, borderBottomLeftRadius: 4, padding: '10px 16px' }}>
                  <span style={{ display: 'inline-flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{
                        width: 7, height: 7, borderRadius: '50%', background: '#94a3b8',
                        display: 'inline-block', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {showQuickReplies && (
            <div style={{
              background: '#fff', borderTop: '1px solid #f1f5f9',
              padding: '8px 12px', display: 'flex', gap: 6, flexWrap: 'wrap',
            }}>
              {lastMsg.quickReplies.map((qr, i) => (
                <button key={i} onClick={() => sendMsg(qr)}
                  style={{
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: 20, padding: '5px 12px', fontSize: 11.5,
                    color: '#1a56db', fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#93c5fd'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >{qr}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            background: '#fff', borderTop: '1px solid #e2e8f0',
            padding: '10px 12px', display: 'flex', gap: 8, flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Haribon anything about DASIG…"
              style={{
                flex: 1, background: '#f8fafc', border: '1.5px solid #e2e8f0',
                borderRadius: 10, padding: '9px 12px', fontSize: 12.5,
                color: '#0f172a', fontFamily: 'inherit', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = '#1a56db'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
            />
            <button onClick={() => sendMsg()} disabled={thinking || !input.trim()}
              style={{
                background: thinking || !input.trim() ? '#e2e8f0' : 'linear-gradient(90deg,#f97316,#e11d48)',
                color: thinking || !input.trim() ? '#94a3b8' : '#fff',
                border: 'none', borderRadius: 10, padding: '9px 14px',
                fontSize: 14, fontWeight: 700,
                cursor: thinking || !input.trim() ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all 0.15s',
              }}
            >→</button>
          </div>
        </div>
      )}

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* FAB button */}
      <button onClick={() => setOpen(o => !o)} title="Chat with Haribon"
        style={{
          position: 'fixed', bottom: 22, right: 22,
          width: 56, height: 56, borderRadius: '50%',
          border: 'none', cursor: 'pointer', zIndex: 9999,
          overflow: 'hidden', padding: 0, background: 'transparent',
          boxShadow: open ? '0 4px 20px rgba(0,29,92,0.4)' : '0 4px 20px rgba(249,115,22,0.42)',
          transition: 'all 0.22s', transform: 'translateZ(0)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {open ? (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg,#001d5c,#1a56db)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 20, fontWeight: 700,
          }}>✕</div>
        ) : (
          <HaribonFace size={56} />
        )}
      </button>
    </>
  );
}
