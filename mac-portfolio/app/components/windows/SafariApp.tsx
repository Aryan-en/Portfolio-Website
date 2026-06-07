"use client";

import { useState, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Share2, Plus, Search, Shield,
  BookOpen, Bookmark, Users, LayoutGrid, X, ExternalLink,
  Laptop, Puzzle,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const FAVOURITES = [
  { name: 'GitHub',         url: 'https://github.com/Aryan-en',             bg: '#161B22', fg: 'white',   label: 'GH',  sz: 20 },
  { name: 'Google',         url: 'https://google.com',                      bg: 'white',   fg: '#4285F4', label: 'G',   sz: 28 },
  { name: 'LeetCode',       url: 'https://leetcode.com',                    bg: '#1A1A1A', fg: '#FFA116', label: 'LC',  sz: 18 },
  { name: 'LinkedIn',       url: 'https://linkedin.com',                    bg: '#0A66C2', fg: 'white',   label: 'in',  sz: 20 },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com',               bg: '#F48024', fg: 'white',   label: 'SO',  sz: 16 },
  { name: 'YouTube',        url: 'https://youtube.com',                     bg: '#FF0000', fg: 'white',   label: '▶',   sz: 20 },
  { name: 'MDN Docs',       url: 'https://developer.mozilla.org',           bg: '#1B1B1B', fg: '#38D9A9', label: 'MDN', sz: 14 },
  { name: 'Vercel',         url: 'https://vercel.com',                      bg: '#000',    fg: 'white',   label: '▲',   sz: 20 },
];

const EXT_COLORS = ['#A855F7', '#EAB308', '#EF4444', '#8B5CF6', '#06B6D4'];

// ─────────────────────────────────────────────────────────────────────────────
// Safari App
// ─────────────────────────────────────────────────────────────────────────────

const BG_TOOLBAR  = '#28282A';
const BG_SIDEBAR  = '#242426';
const BG_CONTENT  = '#1C1C1E';
const BG_CARD     = '#2C2C2E';
const BORDER_COL  = 'rgba(255,255,255,0.07)';
const BLUE        = '#0A84FF';

export function SafariApp() {
  const [showBanner,  setShowBanner]  = useState(true);
  const [showExts,    setShowExts]    = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem,  setActiveItem]  = useState('startpage');
  const [urlInput,    setUrlInput]    = useState('');
  const [currentUrl,  setCurrentUrl]  = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [blocked,     setBlocked]     = useState(false);
  const [iframeKey,   setIframeKey]   = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) { goStart(); return; }

    let url = trimmed;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = trimmed.includes('.') && !trimmed.includes(' ')
        ? 'https://' + trimmed
        : 'https://www.google.com/search?q=' + encodeURIComponent(trimmed);
    }
    setCurrentUrl(url);
    setUrlInput(url);
    setIsLoading(true);
    setBlocked(false);
    setIframeKey(k => k + 1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setIsLoading(false); setBlocked(true); }, 6000);
  };

  const goStart = () => {
    setCurrentUrl('');
    setUrlInput('');
    setActiveItem('startpage');
    setIsLoading(false);
    setBlocked(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const onIframeLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLoading(false);
    setBlocked(false);
  };

  // Display URL (strip protocol for cleaner look when not focused)
  const displayUrl = currentUrl.replace(/^https?:\/\//, '');
  const isStart = !currentUrl;

  return (
    <div className="flex flex-col w-full h-full" style={{ background: BG_CONTENT }}>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-1.5 px-2 flex-shrink-0"
        style={{ height: 46, background: BG_TOOLBAR, borderBottom: `0.5px solid ${BORDER_COL}` }}
      >
        {/* Sidebar toggle */}
        <TBtn onClick={() => setSidebarOpen(s => !s)} title="Toggle Sidebar">
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
            <rect x="0.5" y="0.5" width="15" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5.5 0.5v13" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        </TBtn>

        <div style={{ width: 0.5, height: 18, background: BORDER_COL, margin: '0 2px' }} />

        {/* Back / Forward */}
        <TBtn onClick={goStart} title="Back" disabled={isStart}>
          <ChevronLeft size={18} strokeWidth={2} />
        </TBtn>
        <TBtn disabled title="Forward">
          <ChevronRight size={18} strokeWidth={2} />
        </TBtn>

        {/* URL bar */}
        <form
          className="flex-1 flex items-center gap-2 px-3 rounded-full mx-2 transition-all"
          style={{
            height: 30,
            background: 'rgba(255,255,255,0.08)',
            border: inputFocused ? `1.5px solid ${BLUE}` : '1.5px solid transparent',
          }}
          onSubmit={e => { e.preventDefault(); navigate(urlInput); inputRef.current?.blur(); }}
        >
          <Search size={12} color="rgba(255,255,255,0.35)" className="flex-shrink-0" />
          <input
            ref={inputRef}
            value={inputFocused ? urlInput : (isStart ? '' : displayUrl)}
            onChange={e => setUrlInput(e.target.value)}
            onFocus={() => { setInputFocused(true); setUrlInput(currentUrl); }}
            onBlur={() => setInputFocused(false)}
            placeholder="Search or enter website name"
            className="flex-1 bg-transparent text-[13px] outline-none text-center"
            style={{ color: inputFocused ? 'white' : 'rgba(255,255,255,0.85)', caretColor: 'white' }}
            spellCheck={false}
            autoComplete="off"
          />
        </form>

        {/* Right actions */}
        <TBtn title="Share" disabled={isStart}><Share2 size={14} strokeWidth={1.8} /></TBtn>
        <TBtn title="New Tab"><Plus size={16} strokeWidth={2} /></TBtn>
        <TBtn title="Show Tabs"><LayoutGrid size={14} strokeWidth={1.8} /></TBtn>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        {sidebarOpen && (
          <div
            className="flex flex-col flex-shrink-0 overflow-y-auto pt-4 pb-4"
            style={{ width: 248, background: BG_SIDEBAR, borderRight: `0.5px solid ${BORDER_COL}` }}
          >
            {/* Start Page group */}
            <SidebarSection label="">
              <SidebarItem
                id="startpage" active={activeItem === 'startpage' && isStart}
                icon={<Laptop size={13} strokeWidth={1.8} />}
                label="Start Page"
                onClick={() => { setActiveItem('startpage'); goStart(); }}
              />
              <div style={{ paddingLeft: 36 }}>
                <SidebarItem
                  id="startpage-sub" active={false}
                  icon={<span style={{ fontSize: 11 }}>☆</span>}
                  label="Start Page"
                  onClick={() => { setActiveItem('startpage'); goStart(); }}
                  sub
                />
              </div>
            </SidebarSection>

            {/* Saved */}
            <SidebarSection label="Saved">
              <SidebarItem id="bookmarks"   active={activeItem === 'bookmarks'}   icon={<Bookmark size={13} strokeWidth={1.8} />} label="Bookmarks"       onClick={() => setActiveItem('bookmarks')} />
              <SidebarItem id="readinglist" active={activeItem === 'readinglist'} icon={<BookOpen size={13} strokeWidth={1.8} />} label="Reading List"    onClick={() => setActiveItem('readinglist')} />
              <SidebarItem id="sharedwith"  active={activeItem === 'sharedwith'}  icon={<Users size={13} strokeWidth={1.8} />}    label="Shared with You" onClick={() => setActiveItem('sharedwith')} />
            </SidebarSection>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto" style={{ background: BG_CONTENT }}>
          {isStart ? (
            <StartPage
              showBanner={showBanner} onDismissBanner={() => setShowBanner(false)}
              showExts={showExts} onDismissExts={() => setShowExts(false)}
              onNavigate={navigate}
            />
          ) : (
            <BrowserView
              url={currentUrl} iframeKey={iframeKey}
              isLoading={isLoading} blocked={blocked}
              onLoad={onIframeLoad}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Start Page
// ─────────────────────────────────────────────────────────────────────────────

function StartPage({
  showBanner, onDismissBanner,
  showExts, onDismissExts,
  onNavigate,
}: {
  showBanner: boolean; onDismissBanner: () => void;
  showExts: boolean;   onDismissExts: () => void;
  onNavigate: (url: string) => void;
}) {
  return (
    <div className="px-10 py-6 max-w-[820px] mx-auto">

      {/* ── Default Browser Banner ────────────────────────────────────────── */}
      {showBanner && (
        <div
          className="flex items-center gap-4 p-4 rounded-[14px] mb-5"
          style={{ background: BG_CARD, border: `0.5px solid ${BORDER_COL}` }}
        >
          {/* Close */}
          <button
            onClick={onDismissBanner}
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 cursor-default"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <X size={11} color="rgba(255,255,255,0.60)" />
          </button>

          {/* Safari icon */}
          <div className="w-10 h-10 rounded-[10px] flex-shrink-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#1A96E8,#0055CC)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.4"/>
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M16 8l-5 5-3 1 1-3 5-5 2 2z" fill="white"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-[14px]">Make Safari your default browser?</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Safari brings faster performance, increased privacy protection and longer battery life.
            </p>
          </div>

          <button
            className="px-4 py-[7px] rounded-[8px] text-white text-[13px] font-medium cursor-default flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: BLUE }}
          >
            Make Safari Default
          </button>
        </div>
      )}

      {/* ── Extensions Card ───────────────────────────────────────────────── */}
      {showExts && (
        <div
          className="flex items-center gap-6 p-5 rounded-[18px] mb-7 relative"
          style={{ background: BG_CARD, border: `0.5px solid ${BORDER_COL}` }}
        >
          {/* Dismiss */}
          <button
            onClick={onDismissExts}
            className="absolute top-3 left-3 w-[22px] h-[22px] rounded-full flex items-center justify-center cursor-default"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <X size={11} color="rgba(255,255,255,0.55)" />
          </button>

          {/* Stacked extension icons */}
          <div className="relative w-[120px] h-[72px] flex-shrink-0 ml-4">
            {EXT_COLORS.map((col, i) => (
              <div
                key={i}
                className="absolute w-[42px] h-[42px] rounded-[10px] flex items-center justify-center"
                style={{
                  background: col,
                  left: i * 16,
                  top: i % 2 === 0 ? 0 : 12,
                  transform: `rotate(${(i - 2) * 6}deg)`,
                  zIndex: i,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.40)',
                }}
              >
                <Puzzle size={20} color="white" strokeWidth={1.6} />
              </div>
            ))}
          </div>

          <div>
            <p className="text-white font-bold text-[18px] mb-1">Extensions</p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Supercharge your Safari browsing with extensions that can find discounts, block ads and more.
            </p>
            <button
              className="mt-3 flex items-center gap-1.5 px-4 py-[7px] rounded-[8px] text-white text-[13px] font-medium cursor-default hover:opacity-90 transition-opacity"
              style={{ background: BLUE }}
            >
              <Puzzle size={13} />
              Browse Extensions
            </button>
          </div>
        </div>
      )}

      {/* ── Favourites ────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-white font-bold text-[18px] mb-4">Favourites</h2>
        <div className="grid grid-cols-8 gap-3">
          {FAVOURITES.map(fav => (
            <button
              key={fav.name}
              onClick={() => onNavigate(fav.url)}
              className="flex flex-col items-center gap-1.5 cursor-default group"
            >
              <div
                className="w-[60px] h-[60px] rounded-[14px] flex items-center justify-center transition-transform duration-100 group-hover:scale-105"
                style={{
                  background: fav.bg,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                  border: fav.bg === 'white' ? '0.5px solid rgba(0,0,0,0.10)' : 'none',
                }}
              >
                <span style={{ color: fav.fg, fontSize: fav.sz, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.5px', userSelect: 'none' }}>
                  {fav.label}
                </span>
              </div>
              <span className="text-[10px] text-center truncate w-full" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {fav.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Privacy Report ────────────────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="text-white font-bold text-[18px] mb-4">Privacy Report</h2>
        <div
          className="p-5 rounded-[18px] relative"
          style={{ background: BG_CARD, border: `0.5px solid ${BORDER_COL}` }}
        >
          {/* Gradient shield */}
          <div className="mb-4">
            <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
              <path d="M22 2L4 10v16c0 11 8 20.7 18 24 10-3.3 18-13 18-24V10L22 2z" fill="url(#sg)"/>
              <defs>
                <linearGradient id="sg" x1="4" y1="2" x2="40" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#30D158"/>
                  <stop offset="1" stopColor="#0A84FF"/>
                </linearGradient>
              </defs>
              <path d="M14 26l5 5 11-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
            Safari has not encountered any trackers in the last thirty days. Safari can hide your IP address from known trackers.
          </p>
          <button
            className="absolute bottom-4 right-4 px-3.5 py-[6px] rounded-[8px] text-[13px] font-medium cursor-default"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}
          >
            Edit
          </button>
        </div>
      </section>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Browser iframe view
// ─────────────────────────────────────────────────────────────────────────────

function BrowserView({
  url, iframeKey, isLoading, blocked, onLoad,
}: {
  url: string; iframeKey: number; isLoading: boolean; blocked: boolean; onLoad: () => void;
}) {
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1C1C1E] z-10">
          <div className="w-6 h-6 rounded-full border-[2.5px] border-white/15 border-t-white/70 animate-spin" />
        </div>
      )}

      {blocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10" style={{ background: '#1C1C1E' }}>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <Shield size={24} color="rgba(255,255,255,0.50)" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium text-[16px]">Cannot Open Page</p>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              This site doesn't allow embedding.
            </p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-[8px] rounded-[10px] text-white text-[13px] font-medium transition-opacity hover:opacity-85 cursor-pointer"
            style={{ background: BLUE }}
          >
            <ExternalLink size={13} />
            Open in New Tab
          </a>
        </div>
      )}

      <iframe
        key={iframeKey}
        src={url}
        title="Safari"
        className="absolute inset-0 w-full h-full border-0"
        onLoad={onLoad}
        referrerPolicy="no-referrer"
        allow="fullscreen"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar helpers
// ─────────────────────────────────────────────────────────────────────────────

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      {label && (
        <p className="px-4 pt-1 pb-1 text-[11px] font-semibold text-white/35 tracking-[0.04em]">{label}</p>
      )}
      {children}
    </div>
  );
}

function SidebarItem({
  id, active, icon, label, onClick, sub,
}: {
  id: string; active: boolean; icon: React.ReactNode;
  label: string; onClick: () => void; sub?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-[5px] cursor-default transition-none"
      style={{
        paddingLeft: sub ? 36 : 12,
        borderRadius: 7,
        margin: '0 4px',
        width: 'calc(100% - 8px)',
        background: active ? '#0A84FF' : 'transparent',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ color: active ? 'white' : 'rgba(255,255,255,0.50)', display: 'flex' }}>{icon}</span>
      <span
        className="text-[13px] font-[450]"
        style={{ color: active ? 'white' : 'rgba(255,255,255,0.82)' }}
      >
        {label}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar button
// ─────────────────────────────────────────────────────────────────────────────

function TBtn({ children, onClick, title, disabled }: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] cursor-default transition-colors"
      style={{ color: disabled ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.70)' }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}
