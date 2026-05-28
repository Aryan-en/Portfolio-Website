"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Monitor } from 'lucide-react';
import { useOsStore } from '@/src/store/useOsStore';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { SplashScreen } from './SplashScreen';
import { LoginScreen } from './LoginScreen';

// ─────────────────────────────────────────────────────────────────────────────
// Desktop folder shortcuts
// ─────────────────────────────────────────────────────────────────────────────

interface DesktopFolder {
  id: string;
  title: string;
  /** CSS colour token used for the folder icon and its translucent fill. */
  color: string;
}

const DESKTOP_FOLDERS: DesktopFolder[] = [
  { id: 'about',        title: 'About Me',      color: '#38bdf8' },
  { id: 'projects',     title: 'My Projects',   color: '#a78bfa' },
  { id: 'achievements', title: 'Achievements',  color: '#fbbf24' },
  { id: 'contact',      title: 'Contact',       color: '#4ade80' },
];

// ─────────────────────────────────────────────────────────────────────────────
// FolderIcon
// ─────────────────────────────────────────────────────────────────────────────

function FolderIcon({ id, title, color }: DesktopFolder) {
  const openApp = useOsStore((s) => s.openApp);

  return (
    <motion.button
      onClick={() => openApp(id, title)}
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg w-[72px] cursor-default select-none"
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={`Open ${title}`}
      title={title}
    >
      <Folder
        aria-hidden
        strokeWidth={1.5}
        style={{
          width: 44,
          height: 44,
          color,
          fill: `${color}28`,
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }}
      />
      <span
        className="text-[11px] text-white/90 text-center leading-tight w-full truncate"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
      >
        {title}
      </span>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wallpaper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Multi-layer radial gradient that approximates the depth and colour saturation
 * of macOS Sonoma / Ventura dark wallpapers.  Rendered as a sibling layer
 * (pointer-events-none) so window drag events pass through unobstructed.
 */
const WALLPAPER_GRADIENT = [
  'radial-gradient(ellipse 140% 100% at -5% 0%,   rgba(99,102,241,0.58) 0%, transparent 45%)',
  'radial-gradient(ellipse 110% 90% at 105% -10%, rgba(139,92,246,0.48)  0%, transparent 40%)',
  'radial-gradient(ellipse  80%  70% at  90% 100%,rgba(59,130,246,0.28)  0%, transparent 50%)',
  'radial-gradient(ellipse  60%  60% at  25%  80%,rgba(167,139,250,0.20) 0%, transparent 45%)',
  'linear-gradient(160deg, #040810 0%, #06091a 30%, #080620 60%, #060910 100%)',
].join(', ');

/**
 * Barely-visible grid overlay (3 % opacity) that adds subtle depth, giving the
 * desktop a professional "engineering canvas" quality without distracting from
 * window content.
 */
const GRID_STYLE: React.CSSProperties = {
  backgroundImage: [
    'linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '64px 64px',
};

// ─────────────────────────────────────────────────────────────────────────────
// Mobile fallback
// ─────────────────────────────────────────────────────────────────────────────

function MobileView() {
  const openApp = useOsStore((s) => s.openApp);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#080d1e] to-[#120930] text-white">
      {/* Minimal top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <span className="text-sm font-semibold tracking-wide">Portfolio</span>
        <Monitor size={15} className="text-white/50" aria-hidden />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-7">
        <h1 className="text-2xl font-bold mb-1">Hi, I&apos;m Aryan</h1>
        <p className="text-white/45 text-sm mb-8 tracking-wide">Software Engineer</p>

        <div className="grid grid-cols-2 gap-3">
          {DESKTOP_FOLDERS.map((f) => (
            <motion.button
              key={f.id}
              onClick={() => openApp(f.id, f.title)}
              className="flex flex-col items-center gap-2.5 py-6 rounded-2xl bg-white/5 border border-white/10 cursor-default"
              whileTap={{ scale: 0.95 }}
            >
              <Folder
                aria-hidden
                strokeWidth={1.5}
                style={{ color: f.color, fill: `${f.color}22`, width: 36, height: 36 }}
              />
              <span className="text-xs text-white/75">{f.title}</span>
            </motion.button>
          ))}
        </div>

        <p className="mt-10 text-center text-white/25 text-[11px] leading-relaxed">
          For the full macOS-style experience<br />visit on a desktop browser.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop
// ─────────────────────────────────────────────────────────────────────────────

export function Desktop() {
  const [splashDone, setSplashDone]   = useState(false);
  const [loginDone,  setLoginDone]    = useState(false);

  return (
    <>
      {/* ── Phase 1: Boot splash ── */}
      <AnimatePresence>
        {!splashDone && (
          <SplashScreen onComplete={() => setSplashDone(true)} />
        )}
      </AnimatePresence>

      {/* ── Phase 2: Lock / login screen ── */}
      <AnimatePresence>
        {splashDone && !loginDone && (
          <LoginScreen onComplete={() => setLoginDone(true)} />
        )}
      </AnimatePresence>

      {/* ── Mobile (< 768 px) ── */}
      <div className="md:hidden">
        <MobileView />
      </div>

      {/* ── Desktop (≥ 768 px) ── */}
      <div className="hidden md:block relative w-full h-screen overflow-hidden">

        {/* Wallpaper */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/wallpaper.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Subtle grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={GRID_STYLE}
        />

        {/* Fixed top bar */}
        <MenuBar />

        {/* Canvas — starts immediately below the 28 px menu bar */}
        <main
          className="relative mt-7 overflow-hidden"
          style={{ height: 'calc(100vh - 1.75rem)' }}
        >
          {/* Folder shortcuts — pinned to the right column */}
          <div className="absolute right-3 top-3 flex flex-col gap-1">
            {DESKTOP_FOLDERS.map((f) => (
              <FolderIcon key={f.id} {...f} />
            ))}
          </div>
        </main>

        {/* Fixed bottom dock */}
        <Dock />
      </div>
    </>
  );
}
