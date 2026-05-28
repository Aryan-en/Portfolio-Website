"use client";

import { useEffect, useState } from 'react';
import { Sparkles, Moon, Play, Wifi, BatteryMedium, Search, LayoutGrid } from 'lucide-react';
import { AppleLogo } from './AppleLogo';

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────

const MENU_ITEMS = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Clock — matches macOS format exactly: "Thu 28 May  1:29 PM"
// ─────────────────────────────────────────────────────────────────────────────

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function formatMacTime(date: Date): string {
  const day   = DAYS[date.getDay()];
  const d     = date.getDate();
  const month = MONTHS[date.getMonth()];
  const rawH  = date.getHours();
  const ampm  = rawH >= 12 ? 'PM' : 'AM';
  const h     = rawH % 12 || 12;
  const m     = date.getMinutes().toString().padStart(2, '0');
  // macOS uses the order  "Thu 28 May  1:29 PM"
  return `${day} ${d} ${month}  ${h}:${m} ${ampm}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tray icon wrapper — renders a small translucent hit target around each icon
// ─────────────────────────────────────────────────────────────────────────────

function TrayIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="flex items-center justify-center px-1 py-0.5 rounded hover:bg-white/15 transition-colors duration-150"
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MenuBar
// ─────────────────────────────────────────────────────────────────────────────

export function MenuBar() {
  /**
   * null initial value prevents SSR/client hydration mismatch.
   * The span is blank on the server and fills in after first useEffect tick.
   */
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatMacTime(new Date()));
    const id = setInterval(() => setTime(formatMacTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 w-full h-7 flex items-center justify-between backdrop-blur-xl bg-black/30 border-b border-white/[0.08] text-white text-[13px] select-none">

      {/* ── Left: Apple  ·  App name (bold)  ·  menu items ── */}
      <div className="flex items-center h-full">

        {/* Apple logo — slightly more padding than menu items */}
        <button
          aria-label="Apple menu"
          className="flex items-center justify-center h-full px-3 hover:bg-white/10 transition-colors duration-150"
        >
          <AppleLogo size={15} color="white" aria-hidden />
        </button>

        {/* Active app name — bold, matches macOS "Finder" weight */}
        <button className="flex items-center h-full px-2.5 font-semibold hover:bg-white/10 transition-colors duration-150 tracking-[-0.01em]">
          Aryan&apos;s Portfolio
        </button>

        {/* Standard menu items — regular weight, slightly muted */}
        {MENU_ITEMS.map((item) => (
          <button
            key={item}
            className="flex items-center h-full px-2.5 font-normal text-white/90 hover:bg-white/10 transition-colors duration-150"
          >
            {item}
          </button>
        ))}
      </div>

      {/* ── Right: system tray icons + clock ── */}
      <div className="flex items-center h-full pr-1">

        <TrayIcon label="Siri">
          <Sparkles size={13} strokeWidth={1.75} />
        </TrayIcon>

        <TrayIcon label="Focus">
          <Moon size={13} strokeWidth={1.75} />
        </TrayIcon>

        <TrayIcon label="Now Playing">
          <Play size={12} strokeWidth={2} fill="white" />
        </TrayIcon>

        <TrayIcon label="Wi-Fi">
          <Wifi size={13} strokeWidth={1.75} />
        </TrayIcon>

        <TrayIcon label="Battery">
          <BatteryMedium size={15} strokeWidth={1.5} />
        </TrayIcon>

        <TrayIcon label="Spotlight">
          <Search size={13} strokeWidth={1.75} />
        </TrayIcon>

        <TrayIcon label="Control Centre">
          <LayoutGrid size={12} strokeWidth={2} />
        </TrayIcon>

        {/*
          Fixed min-width prevents layout shift between different clock
          string lengths (e.g. "9:59" vs "10:00"). tabular-nums stops
          individual digit columns from shifting on every tick.
        */}
        <span
          className="min-w-[148px] text-right pr-2 pl-1 text-[13px] font-normal tabular-nums text-white/95"
          suppressHydrationWarning
        >
          {time ?? ''}
        </span>
      </div>
    </header>
  );
}
