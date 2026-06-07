"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { ExternalLink } from 'lucide-react';
import { useOsStore, type AppWindow as AppWindowType } from '@/src/store/useOsStore';
import { SocialProfile } from './windows/SocialProfile';
import { TerminalApp } from './windows/TerminalApp';
import { FinderApp } from './windows/FinderApp';
import { SettingsApp } from './windows/SettingsApp';
import { MailApp } from './windows/MailApp';
import { SafariApp } from './windows/SafariApp';
import { ClaudeApp } from './windows/ClaudeApp';

// ─────────────────────────────────────────────────────────────────────────────
// App routing — social/terminal get custom UIs; everything else uses iframe
// ─────────────────────────────────────────────────────────────────────────────

// These apps block iframe embedding — we show custom profile cards instead.
const SOCIAL_APPS = new Set(['leetcode', 'github', 'linkedin', 'instagram']);

export const APP_URLS: Record<string, string> = {
  appstore: 'https://apps.apple.com',
  notes:    'https://www.notion.so',
  preview:  'https://www.figma.com',
};

// ─────────────────────────────────────────────────────────────────────────────
// Traffic-light button
// ─────────────────────────────────────────────────────────────────────────────

function TrafficLight({
  color, icon, label, onClick,
}: { color: string; icon: string; label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      aria-label={label}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="w-[13px] h-[13px] rounded-full flex items-center justify-center cursor-default active:brightness-75 flex-shrink-0"
      style={{ background: color }}
    >
      <span
        style={{
          fontSize: 8,
          fontWeight: 700,
          lineHeight: 1,
          color: 'rgba(0,0,0,0.55)',
          opacity: hov ? 1 : 0,
          transition: 'opacity 80ms',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {icon}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AppWindow
// ─────────────────────────────────────────────────────────────────────────────

interface Props { win: AppWindowType }

export function AppWindow({ win }: Props) {
  const closeApp          = useOsStore((s) => s.closeApp);
  const minimizeApp       = useOsStore((s) => s.minimizeApp);
  const toggleMaximizeApp = useOsStore((s) => s.toggleMaximizeApp);
  const focusApp          = useOsStore((s) => s.focusApp);
  const updateAppLayout   = useOsStore((s) => s.updateAppLayout);

  const [iframeLoading, setIframeLoading] = useState(true);
  const [closing, setClosing]             = useState(false);
  const [timedOut, setTimedOut]           = useState(false);

  const url         = APP_URLS[win.id];
  const CUSTOM_APPS = new Set(['terminal', 'finder', 'settings', 'mail', 'safari', 'claude']);
  const usesIframe  = !SOCIAL_APPS.has(win.id) && !CUSTOM_APPS.has(win.id) && !!url;

  // 7-second fallback only matters for real iframe apps
  useEffect(() => {
    if (!usesIframe || !iframeLoading) return;
    const t = setTimeout(() => setTimedOut(true), 7000);
    return () => clearTimeout(t);
  }, [usesIframe, iframeLoading]);

  // Kick off close animation; store removal happens on animation completion.
  const handleClose = () => setClosing(true);

  // ── Shared frame content ──────────────────────────────────────────────────

  const windowFrame = (
    <motion.div
      className="flex flex-col w-full h-full rounded-[12px] overflow-hidden"
      style={{
        boxShadow: [
          '0 28px 100px rgba(0,0,0,0.60)',
          '0 6px 20px rgba(0,0,0,0.35)',
          'inset 0 0 0 0.5px rgba(255,255,255,0.10)',
        ].join(', '),
      }}
      initial={{ opacity: 0, scale: 0.93, y: 18 }}
      animate={
        closing
          ? { opacity: 0, scale: 0.90, y: 12 }
          : { opacity: 1, scale: 1,    y: 0  }
      }
      transition={{ duration: closing ? 0.18 : 0.24, ease: [0.25, 0.1, 0.25, 1] }}
      onAnimationComplete={() => { if (closing) closeApp(win.id); }}
      onMouseDown={() => focusApp(win.id)}
    >
      {/* ── Title bar ─────────────────────────────────────────────────────── */}
      <div
        className="window-titlebar flex items-center h-[38px] px-3 gap-2 flex-shrink-0 relative select-none border-b border-white/[0.07]"
        style={{ background: 'rgba(30,30,32,0.94)', backdropFilter: 'blur(20px)' }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-[7px] z-10">
          <TrafficLight color="#FF5F57" icon="×" label="Close"    onClick={handleClose} />
          <TrafficLight color="#FEBC2E" icon="−" label="Minimise" onClick={() => minimizeApp(win.id)} />
          <TrafficLight
            color="#28C840"
            icon={win.isMaximized ? '⊡' : '⤢'}
            label={win.isMaximized ? 'Restore' : 'Maximise'}
            onClick={() => toggleMaximizeApp(win.id)}
          />
        </div>

        {/* Centred title */}
        <p className="absolute inset-x-0 text-center text-[13px] font-medium text-white/70 tracking-tight pointer-events-none truncate px-24">
          {win.title}
        </p>

        {/* External-link shortcut — shown for iframe apps only */}
        {usesIframe && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-white/30 hover:text-white/70 transition-colors duration-150 z-10 cursor-default"
            aria-label={`Open ${win.title} in browser`}
            title="Open in browser"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={13} strokeWidth={1.75} />
          </a>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Social profile cards (sites that block iframe embedding) */}
        {SOCIAL_APPS.has(win.id) ? (
          <SocialProfile platform={win.id} />

        ) : win.id === 'finder' ? (
          <FinderApp />

        ) : win.id === 'settings' ? (
          <SettingsApp />

        ) : win.id === 'terminal' ? (
          <TerminalApp />

        ) : win.id === 'mail' ? (
          <MailApp />

        ) : win.id === 'safari' ? (
          <SafariApp />

        ) : win.id === 'claude' ? (
          <ClaudeApp />

        ) : url ? (
          <div className="relative w-full h-full bg-white">
            {/* Loading overlay */}
            {(iframeLoading || timedOut) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#F5F5F7] z-10">
                {timedOut ? (
                  <>
                    <p className="text-[13px] text-gray-500 font-medium">
                      This site doesn&apos;t allow embedding.
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium transition-colors cursor-default"
                    >
                      <ExternalLink size={13} strokeWidth={2} />
                      Open in Browser
                    </a>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full border-[2.5px] border-gray-200 border-t-blue-500 animate-spin" />
                    <p className="text-[12px] text-gray-400">Loading {win.title}…</p>
                  </>
                )}
              </div>
            )}
            <iframe
              src={url}
              title={win.title}
              className="absolute inset-0 w-full h-full border-0"
              onLoad={() => { setIframeLoading(false); setTimedOut(false); }}
              allow="clipboard-read; clipboard-write; fullscreen"
              referrerPolicy="no-referrer"
            />
          </div>

        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-[#F5F5F7] gap-2">
            <p className="text-[13px] text-gray-400 font-medium">{win.title}</p>
            <p className="text-[12px] text-gray-300">Coming soon</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  // ── Maximised — cover the full desktop canvas ─────────────────────────────

  if (win.isMaximized) {
    return (
      <div className="absolute inset-0" style={{ zIndex: win.zIndex }}>
        {windowFrame}
      </div>
    );
  }

  // ── Normal — draggable + resizable via react-rnd ──────────────────────────

  return (
    <Rnd
      position={{ x: win.x, y: win.y }}
      size={{ width: win.width, height: win.height }}
      minWidth={520}
      minHeight={360}
      dragHandleClassName="window-titlebar"
      bounds="parent"
      style={{ zIndex: win.zIndex }}
      onDragStart={() => focusApp(win.id)}
      onDragStop={(_, d) => updateAppLayout(win.id, { x: d.x, y: d.y })}
      onResizeStart={() => focusApp(win.id)}
      onResizeStop={(_, __, ref, ___, pos) =>
        updateAppLayout(win.id, {
          x: pos.x, y: pos.y,
          width: ref.offsetWidth, height: ref.offsetHeight,
        })
      }
    >
      {windowFrame}
    </Rnd>
  );
}
