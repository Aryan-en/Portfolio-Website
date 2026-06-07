"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Monitor } from 'lucide-react';
import { useOsStore } from '@/src/store/useOsStore';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { SplashScreen } from './SplashScreen';
import { LoginScreen } from './LoginScreen';
import { CalendarWidget } from './widgets/CalendarWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { WindowManager } from './WindowManager';
// import { PhotosWidget } from './widgets/PhotosWidget';

// ─────────────────────────────────────────────────────────────────────────────
// Desktop folder shortcuts
// ─────────────────────────────────────────────────────────────────────────────

interface DesktopFolder {
  id: string;
  title: string;
  /** CSS colour token used for the folder icon and its translucent fill. */
  color: string;
}



// ─────────────────────────────────────────────────────────────────────────────
// Project repo icon (desktop — opens GitHub in new tab)
// ─────────────────────────────────────────────────────────────────────────────

interface DesktopProject {
  name: string;
  url: string;
}

const DESKTOP_PROJECTS: DesktopProject[] = [
  { name: 'ISL_translator',         url: 'https://github.com/Aryan-en/ISL_translator'         },
  { name: 'AutoDesk_Img_to_CAD',    url: 'https://github.com/Aryan-en/AutoDesk_Img_to_CAD'    },
  { name: 'CommisPro',              url: 'https://github.com/Aryan-en/CommisPro'              },
  { name: 'PEC_APP_Platform',       url: 'https://github.com/Aryan-en/PEC_APP_Platform'       },
  { name: 'Matcha-AI-DTU',          url: 'https://github.com/Aryan-en/Matcha-AI-DTU'          },
  { name: 'CommissionAI_KloudStax', url: 'https://github.com/Aryan-en/CommissionAI_KloudStax' },
  { name: 'DataForge_Finals',       url: 'https://github.com/Aryan-en/DataForge_Finals'       },
  { name: 'Lotify-Flutter',         url: 'https://github.com/Aryan-en/Lotify-Flutter'         },
  { name: 'gramin-saathi',          url: 'https://github.com/Aryan-en/gramin-saathi'          },
  { name: 'KDSH_2026_Hackthon',     url: 'https://github.com/Aryan-en/KDSH_2026_Hackthon'     },
];

function ProjectIcon({ name, url }: DesktopProject) {
  return (
    <motion.button
      onClick={() => window.open(url, '_blank')}
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg w-[72px] cursor-default select-none"
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={name}
      title={name}
    >
      {/* GitHub-style dark repo icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: 'linear-gradient(145deg,#1C1C1E,#2C2C2E)',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" fillOpacity="0.88">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      </div>
      <span
        className="text-[10px] text-white/85 text-center leading-tight w-full"
        style={{
          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          wordBreak: 'break-all',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {name}
      </span>
    </motion.button>
  );
}

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

        {/* <div className="grid grid-cols-2 gap-3">
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
        </div> */}

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
          {/* Widgets — pinned to the top-left */}
          <div className="absolute left-4 top-3 flex flex-col gap-3 pointer-events-auto">
            {/* Row 1: Calendar + Weather */}
            <div className="flex gap-3">
              <CalendarWidget />
              <WeatherWidget />
            </div>
            {/* Row 2: Photos (spans both columns) */}
            {/* <PhotosWidget /> */}
          </div>

          {/* Project icons — two columns pinned to the right side */}
          <div
            className="absolute right-3 top-3 grid pointer-events-auto"
            style={{
              gridTemplateColumns: 'repeat(2, 72px)',
              gap: '2px',
              paddingBottom: 90,
            }}
          >
            {DESKTOP_PROJECTS.map(p => (
              <ProjectIcon key={p.name} name={p.name} url={p.url} />
            ))}
          </div>

          {/* All open app windows — rendered above desktop content */}
          <WindowManager />
        </main>

        {/* Fixed bottom dock */}
        <Dock />
      </div>
    </>
  );
}
