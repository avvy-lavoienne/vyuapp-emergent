'use client';

import { useState, useEffect, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';

// Simple markdown to HTML parser
function parseMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#f0f0f0;padding:1px 4px;border-radius:3px;font-size:12px">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      const safe = /^(https?:\/\/)/i.test(url) ? url : '#';
      return `<a href="${safe}" target="_blank" rel="noopener" style="color:#6D5BA0;text-decoration:underline">${text}</a>`;
    })
    .replace(/\n/g, '<br/>');
}

const STORAGE_KEY = 'vyuapp_chat_history';
const RATE_LIMIT = 5;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
        // Count visitor messages
        setMessageCount(parsed.filter(m => m.role === 'visitor').length);
      }
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (messageCount >= RATE_LIMIT) {
      setMessages(prev => [...prev, {
        role: 'system',
        text: 'Batas pesan tercapai (5 pesan per sesi). Silakan refresh halaman untuk memulai sesi baru.',
        time: Date.now()
      }]);
      return;
    }

    const visitorMsg = { role: 'visitor', text, time: Date.now() };
    setMessages(prev => [...prev, visitorMsg]);
    setInput('');
    setMessageCount(prev => prev + 1);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'agent', text: data.reply, time: Date.now() }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'agent', text: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.', time: Date.now() }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: 'Gagal menghubungi server. Periksa koneksi Anda.', time: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setMessageCount(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          height: '48px',
          padding: '0 20px',
          borderRadius: '24px',
          backgroundColor: '#6D5BA0',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(109,91,160,0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'transform 0.2s ease, background-color 0.2s ease',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
          fontSize: '14px',
          fontWeight: 600,
        }}
        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1)'; }}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="10" r="0.5" fill="currentColor" />
              <circle cx="8" cy="10" r="0.5" fill="currentColor" />
              <circle cx="16" cy="10" r="0.5" fill="currentColor" />
            </svg>
            <span>Chat dengan Hana</span>
          </>
        )}
      </button>

      {/* Chat Panel */}
      <div
        style={{
          position: 'fixed',
          bottom: '92px',
          right: '24px',
          width: 'min(380px, calc(100vw - 32px))',
          height: 'min(520px, calc(100vh - 120px))',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9998,
          transformOrigin: 'bottom right',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(16px)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #6D5BA0, #8B7BC4)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Hana — VyuApp Support</div>
            <div style={{ fontSize: '12px', opacity: 0.85, marginTop: 2 }}>
              {loading ? 'Mengetik...' : 'Online'}
            </div>
          </div>
          <button
            onClick={clearChat}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: '#F8F7FC',
        }}>
          {messages.length === 0 && (
            <div style={{
              textAlign: 'center',
              color: '#888',
              fontSize: '13px',
              padding: '40px 16px',
            }}>
              🌸 Selamat datang di VyuApp! Saya Hana, ada yang bisa saya bantu hari ini?
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'visitor' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: msg.role === 'visitor'
                  ? '14px 14px 4px 14px'
                  : '14px 14px 14px 4px',
                backgroundColor: msg.role === 'visitor' ? '#6D5BA0' : '#fff',
                color: msg.role === 'visitor' ? '#fff' : '#141413',
                fontSize: '13.5px',
                lineHeight: '1.5',
                boxShadow: msg.role !== 'visitor' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.role === 'visitor' ? msg.text : <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(msg.text)) }} />}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '10px 18px',
                borderRadius: '14px 14px 14px 4px',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                fontSize: '13px',
                color: '#999',
              }}>
                <span className="chat-typing-dots">
                  <span>●</span><span>●</span><span>●</span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #eee',
          display: 'flex',
          gap: '8px',
          backgroundColor: '#fff',
          flexShrink: 0,
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan..."
            disabled={loading || messageCount >= RATE_LIMIT}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1.5px solid #ddd',
              fontSize: '13.5px',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: messageCount >= RATE_LIMIT ? '#f5f5f5' : '#fff',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#6D5BA0'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#ddd'; }}
          />
          <button
            aria-label="Kirim pesan"
            onClick={sendMessage}
            disabled={!input.trim() || loading || messageCount >= RATE_LIMIT}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: input.trim() && !loading && messageCount < RATE_LIMIT ? '#6D5BA0' : '#ddd',
              color: '#fff',
              border: 'none',
              cursor: input.trim() && !loading && messageCount < RATE_LIMIT ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Typing animation CSS */}
      <style jsx global>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .chat-typing-dots span {
          display: inline-block;
          animation: chatBounce 1.4s infinite;
          color: #6D5BA0;
          font-size: 10px;
          margin: 0 1px;
        }
        .chat-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </>
  );
}
