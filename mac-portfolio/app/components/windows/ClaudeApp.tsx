"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Square, Plus, Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ts: Date;
}

const SUGGESTIONS = [
  "Tell me about Aryan's portfolio",
  "What tech stack was used to build this?",
  "What projects has Aryan built?",
  "Explain what makes this portfolio unique",
];

// ─────────────────────────────────────────────────────────────────────────────
// Claude logo mark (Anthropic brand shape)
// ─────────────────────────────────────────────────────────────────────────────

function ClaudeMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="none" aria-label="Claude">
      <path
        d="M20.6 3C11 3 3 11 3 20.6s8 17.6 17.6 17.6 17.6-8 17.6-17.6S30.2 3 20.6 3zm0 2.8c8.2 0 14.8 6.6 14.8 14.8S28.8 35.4 20.6 35.4 5.8 28.8 5.8 20.6 12.4 5.8 20.6 5.8z"
        fill="currentColor" fillOpacity="0.15"
      />
      <path
        d="M26.7 13.4l-4.5 11.2h-1.5L16.2 13.4h2.3l3.1 8.4 3.1-8.4h2zM13.8 13.4h2.1v11.2h-2.1zM25.8 13.4h2.1v11.2h-2.1z"
        fill="currentColor"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Markdown-lite renderer (bold, code, newlines)
// ─────────────────────────────────────────────────────────────────────────────

function MdText({ text }: { text: string }) {
  // Split on code blocks first
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3).replace(/^\w+\n/, '');
          return (
            <pre key={i} className="rounded-[8px] p-3 my-2 overflow-x-auto text-[12px] leading-relaxed"
              style={{ background: 'rgba(0,0,0,0.35)', color: '#E2E8F0', fontFamily: 'monospace' }}>
              <code>{code}</code>
            </pre>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="px-1 py-0.5 rounded text-[12px]"
              style={{ background: 'rgba(0,0,0,0.30)', color: '#F9A8D4', fontFamily: 'monospace' }}>
              {part.slice(1, -1)}
            </code>
          );
        }
        // Bold: **text**
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {boldParts.map((bp, j) => {
              if (bp.startsWith('**') && bp.endsWith('**')) {
                return <strong key={j} className="text-white font-semibold">{bp.slice(2, -2)}</strong>;
              }
              return <span key={j}>{bp.split('\n').map((line, k, arr) => (
                <span key={k}>{line}{k < arr.length - 1 && <br />}</span>
              ))}</span>;
            })}
          </span>
        );
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Claude App
// ─────────────────────────────────────────────────────────────────────────────

export function ClaudeApp() {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [apiMissing, setApiMissing] = useState(false);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef    = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [input]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      const data = await res.json() as { content?: string; error?: string };

      if (!res.ok || data.error) {
        if (data.error?.includes('ANTHROPIC_API_KEY')) {
          setApiMissing(true);
        } else {
          setError(data.error ?? 'Something went wrong');
        }
        return;
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.content ?? '',
        ts: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') {
        setError(e.message);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const stopGeneration = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#1A1A1C', fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.07)', background: '#1E1E20' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #D4A27A 0%, #CC785C 100%)' }}
          >
            <ClaudeMark size={16} />
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold leading-tight">Claude</p>
            <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.35)' }}>
              claude-sonnet-4-6 · Anthropic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <IconBtn title="New Chat" onClick={clearChat}><Plus size={15} strokeWidth={2} /></IconBtn>
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

        {/* API key missing notice */}
        {apiMissing && (
          <div className="rounded-[12px] p-4 text-[13px] leading-relaxed"
            style={{ background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.25)', color: '#FCD34D' }}>
            <p className="font-semibold mb-1">API key not configured</p>
            <p style={{ color: 'rgba(252,211,77,0.70)' }}>
              Add <code className="px-1 py-0.5 rounded text-[11px]"
                style={{ background: 'rgba(0,0,0,0.30)', fontFamily: 'monospace' }}>
                ANTHROPIC_API_KEY=sk-ant-…
              </code> to <code className="px-1 py-0.5 rounded text-[11px]"
                style={{ background: 'rgba(0,0,0,0.30)', fontFamily: 'monospace' }}>.env.local</code> and restart the dev server.
            </p>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && !apiMissing && (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #D4A27A 0%, #CC785C 100%)' }}
            >
              <ClaudeMark size={32} />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-[17px]">How can I help you?</p>
              <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
                Ask me anything about Aryan&apos;s portfolio or anything else.
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-[460px]">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left px-3.5 py-2.5 rounded-[10px] text-[12px] cursor-default transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '0.5px solid rgba(255,255,255,0.10)',
                    color: 'rgba(255,255,255,0.70)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

            {/* Avatar */}
            <div className="flex-shrink-0 mt-0.5">
              {msg.role === 'assistant' ? (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #D4A27A 0%, #CC785C 100%)' }}
                >
                  <ClaudeMark size={15} />
                </div>
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[12px] font-semibold"
                  style={{ background: 'linear-gradient(135deg, #5E5CE6, #0A84FF)' }}
                >
                  A
                </div>
              )}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col gap-1 max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className="px-4 py-2.5 rounded-[16px] text-[13px] leading-[1.6]"
                style={msg.role === 'user' ? {
                  background: '#3577DB',
                  color: 'white',
                  borderBottomRightRadius: 4,
                } : {
                  background: 'rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.88)',
                  borderBottomLeftRadius: 4,
                }}
              >
                {msg.role === 'assistant'
                  ? <MdText text={msg.content} />
                  : <span>{msg.content}</span>}
              </div>

              {/* Action row for assistant messages */}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MsgBtn title="Copy" onClick={() => navigator.clipboard.writeText(msg.content)}>
                    <Copy size={11} />
                  </MsgBtn>
                  <MsgBtn title="Regenerate" onClick={() => {}}>
                    <RotateCcw size={11} />
                  </MsgBtn>
                  <MsgBtn title="Good response"><ThumbsUp size={11} /></MsgBtn>
                  <MsgBtn title="Bad response"><ThumbsDown size={11} /></MsgBtn>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(135deg, #D4A27A 0%, #CC785C 100%)' }}
            >
              <ClaudeMark size={15} />
            </div>
            <div
              className="px-4 py-3 rounded-[16px] flex items-center gap-1.5"
              style={{ background: 'rgba(255,255,255,0.07)', borderBottomLeftRadius: 4 }}
            >
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: 'rgba(255,255,255,0.40)', animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error notice */}
        {error && (
          <div className="text-center text-[12px] px-4 py-2 rounded-[8px]"
            style={{ background: 'rgba(255,59,48,0.12)', color: '#FF6B6B', border: '0.5px solid rgba(255,59,48,0.25)' }}>
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ──────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-4 pb-4 pt-2"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="flex items-end gap-2 rounded-[16px] px-4 py-2.5"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '0.5px solid rgba(255,255,255,0.12)',
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Claude…"
            rows={1}
            className="flex-1 bg-transparent text-[13px] outline-none resize-none leading-[1.5] py-0.5"
            style={{
              color: 'rgba(255,255,255,0.88)',
              caretColor: 'white',
              maxHeight: 160,
              overflowY: 'auto',
            }}
          />
          <button
            onClick={loading ? stopGeneration : () => sendMessage(input)}
            disabled={!loading && !input.trim()}
            className="flex-shrink-0 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center cursor-default transition-all"
            style={{
              background: loading
                ? 'rgba(255,255,255,0.15)'
                : input.trim()
                ? '#D4A27A'
                : 'rgba(255,255,255,0.10)',
              opacity: !loading && !input.trim() ? 0.4 : 1,
            }}
          >
            {loading
              ? <Square size={12} fill="white" color="white" />
              : <Send size={13} color={input.trim() ? '#1A1A1C' : 'rgba(255,255,255,0.60)'} strokeWidth={2.2} />}
          </button>
        </div>
        <p className="text-center mt-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.20)' }}>
          Claude can make mistakes. Press ⏎ to send, ⇧⏎ for new line.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────────

function IconBtn({ children, onClick, title }: { children: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-[28px] h-[28px] flex items-center justify-center rounded-[7px] cursor-default transition-colors"
      style={{ color: 'rgba(255,255,255,0.50)' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'white'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; }}
    >
      {children}
    </button>
  );
}

function MsgBtn({ children, onClick, title }: { children: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-[22px] h-[22px] flex items-center justify-center rounded-[5px] cursor-default"
      style={{ color: 'rgba(255,255,255,0.30)' }}
      onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.70)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.30)'; e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}
