"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, WifiOff, Bluetooth, Share2, Moon, Monitor, Volume2, VolumeX,
  Sun, ChevronRight, Check, SkipBack, Play, Pause, SkipForward,
  Music2, Zap, ZapOff, Radio, Search, X, Lock, Smartphone,
  Laptop, Sparkles, ChevronLeft, ChevronDown, Globe, Settings, Folder,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type TrayPanelId =
  | 'controlcenter' | 'wifi' | 'battery' | 'nowplaying'
  | 'focus' | 'spotlight' | 'clock';

export interface TrayPanelState {
  id: TrayPanelId;
  rightEdge: number;   // right edge of the clicked icon (viewport px)
  topY: number;        // bottom of menu bar (viewport px)
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

/** Pill toggle — macOS style */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      className="relative flex-shrink-0 cursor-default transition-all duration-200"
      style={{
        width: 36, height: 21,
        borderRadius: 999,
        background: on ? '#32D74B' : 'rgba(255,255,255,0.18)',
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.15)',
      }}
    >
      <span
        className="absolute top-[2px] w-[17px] h-[17px] rounded-full bg-white shadow-md transition-transform duration-200"
        style={{ transform: on ? 'translateX(16px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

/** Horizontal slider */
function Slider({
  value, onChange, icon,
}: { value: number; onChange: (v: number) => void; icon: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging  = useRef(false);

  const setFromEvent = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange(Math.round(pct * 100));
  }, [onChange]);

  return (
    <div className="flex items-center gap-3 px-4 py-[10px]">
      <span className="text-white/50 flex-shrink-0 w-[16px] flex items-center justify-center">{icon}</span>
      <div
        ref={trackRef}
        className="flex-1 relative cursor-pointer py-[6px]"
        onMouseDown={e => {
          dragging.current = true;
          setFromEvent(e.clientX);
        }}
      >
        <div
          className="relative h-[4px] rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white"
            style={{ width: `${value}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full bg-white shadow-md"
            style={{ left: `calc(${value}% - 7px)` }}
          />
        </div>
      </div>
      <span className="text-[11px] text-white/40 w-[26px] text-right flex-shrink-0">
        {value}%
      </span>
    </div>
  );
}

// Global drag handler for sliders
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    // handled by each slider's own ref
  });
  window.addEventListener('mouseup', () => {
    // reset dragging
  });
}

/** Panel section divider */
function Divider() {
  return <div style={{ height: 0.5, background: 'rgba(255,255,255,0.10)', margin: '0 0' }} />;
}

/** Section label */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-white/40 uppercase tracking-[0.06em]">
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel wrapper — portal, positioned relative to tray icon
// ─────────────────────────────────────────────────────────────────────────────

interface WrapperProps {
  rightEdge: number;
  topY: number;
  width: number;
  onClose: () => void;
  children: React.ReactNode;
}

function PanelWrapper({ rightEdge, topY, width, onClose, children }: WrapperProps) {
  const right = typeof window !== 'undefined' ? window.innerWidth - rightEdge : 0;

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0"
        style={{ zIndex: 9998 }}
        onMouseDown={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -6 }}
        transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed rounded-[18px] overflow-hidden"
        style={{
          right: Math.max(8, right),
          top: topY + 4,
          width,
          zIndex: 9999,
          background: 'rgba(25, 25, 28, 0.90)',
          backdropFilter: 'blur(60px) saturate(2)',
          WebkitBackdropFilter: 'blur(60px) saturate(2)',
          boxShadow: [
            '0 20px 80px rgba(0,0,0,0.65)',
            '0 4px 20px rgba(0,0,0,0.40)',
            'inset 0 0 0 0.5px rgba(255,255,255,0.13)',
          ].join(', '),
          transformOrigin: 'top right',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared tray state (lifted to parent — passed in as props)
// ─────────────────────────────────────────────────────────────────────────────

export interface TraySharedState {
  wifiOn:      boolean; setWifiOn:      (v: boolean) => void;
  bluetoothOn: boolean; setBluetoothOn: (v: boolean) => void;
  airdropMode: 'off' | 'contacts' | 'everyone';
  setAirdropMode: (v: 'off' | 'contacts' | 'everyone') => void;
  focusMode:   'off' | 'dnd' | 'work' | 'sleep';
  setFocusMode:(v: 'off' | 'dnd' | 'work' | 'sleep') => void;
  brightness:  number; setBrightness:  (v: number) => void;
  volume:      number; setVolume:      (v: number) => void;
  lowPower:    boolean; setLowPower:   (v: boolean) => void;
  isPlaying:   boolean; setIsPlaying:  (v: boolean) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Control Centre
// ─────────────────────────────────────────────────────────────────────────────

const WIFI_NETWORKS = [
  { ssid: 'HomeWifi 5G', signal: 3, secured: true, connected: true },
  { ssid: 'HomeWifi',    signal: 2, secured: true, connected: false },
  { ssid: 'TP-Link_A4F2', signal: 2, secured: true, connected: false },
  { ssid: 'FBI Surveillance Van', signal: 1, secured: false, connected: false },
  { ssid: "Aryan's iPhone", signal: 3, secured: true, connected: false },
];

const FOCUS_MODES = [
  { id: 'dnd',  label: 'Do Not Disturb', icon: <Moon size={13} />,      color: '#8E8E93' },
  { id: 'work', label: 'Work',           icon: <Laptop size={13} />,    color: '#0A84FF' },
  { id: 'sleep',label: 'Sleep',          icon: <Moon size={13} />,      color: '#5E5CE6' },
] as const;

function SignalBars({ strength }: { strength: number }) {
  return (
    <span className="flex items-end gap-[1.5px] h-[10px]">
      {[1, 2, 3].map(b => (
        <span
          key={b}
          style={{
            width: 2.5,
            height: b === 1 ? 4 : b === 2 ? 6.5 : 10,
            borderRadius: 1,
            background: b <= strength ? 'white' : 'rgba(255,255,255,0.25)',
          }}
        />
      ))}
    </span>
  );
}

function CCTile({
  icon, label, sublabel, on, wide, onToggle, onChevron,
}: {
  icon: React.ReactNode; label: string; sublabel?: string;
  on?: boolean; wide?: boolean;
  onToggle?: () => void; onChevron?: () => void;
}) {
  return (
    <div
      className="rounded-[12px] p-[10px] flex flex-col justify-between cursor-default"
      style={{
        background: on ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)',
        minHeight: wide ? 64 : 64,
        position: 'relative',
      }}
      onClick={onToggle}
    >
      <div
        className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-white"
        style={{ background: on ? 'white' : 'rgba(255,255,255,0.15)' }}
      >
        <span style={{ color: on ? '#1C1C1E' : 'white', display: 'flex' }}>{icon}</span>
      </div>
      <div>
        <p className="text-white text-[12px] font-semibold leading-tight">{label}</p>
        {sublabel && <p className="text-white/55 text-[11px] mt-0.5 leading-tight">{sublabel}</p>}
      </div>
      {onChevron && (
        <button
          onClick={e => { e.stopPropagation(); onChevron(); }}
          className="absolute top-[8px] right-[8px] w-[18px] h-[18px] rounded-full flex items-center justify-center hover:bg-white/20"
        >
          <ChevronRight size={10} color="rgba(255,255,255,0.50)" />
        </button>
      )}
    </div>
  );
}

function ControlCenterPanel({ s, rightEdge, topY, onClose }: { s: TraySharedState; rightEdge: number; topY: number; onClose: () => void }) {
  const focusLabel = s.focusMode === 'off' ? 'Off'
    : s.focusMode === 'dnd' ? 'Do Not Disturb'
    : s.focusMode === 'work' ? 'Work'
    : 'Sleep';

  const airdropLabel = s.airdropMode === 'off' ? 'Off'
    : s.airdropMode === 'contacts' ? 'Contacts Only'
    : 'Everyone';

  return (
    <PanelWrapper rightEdge={rightEdge} topY={topY} width={316} onClose={onClose}>
      <div className="p-3 space-y-[6px]">

        {/* Row 1: Wi-Fi + Bluetooth */}
        <div className="grid grid-cols-2 gap-[6px]">
          <CCTile
            icon={<Wifi size={14} />}
            label="Wi-Fi"
            sublabel={s.wifiOn ? 'HomeWifi 5G' : 'Off'}
            on={s.wifiOn}
            onToggle={() => s.setWifiOn(!s.wifiOn)}
          />
          <CCTile
            icon={<Bluetooth size={14} />}
            label="Bluetooth"
            sublabel={s.bluetoothOn ? 'On' : 'Off'}
            on={s.bluetoothOn}
            onToggle={() => s.setBluetoothOn(!s.bluetoothOn)}
          />
        </div>

        {/* Row 2: AirDrop + Focus */}
        <div className="grid grid-cols-2 gap-[6px]">
          <CCTile
            icon={<Radio size={14} />}
            label="AirDrop"
            sublabel={airdropLabel}
            on={s.airdropMode !== 'off'}
            onToggle={() => s.setAirdropMode(s.airdropMode === 'off' ? 'contacts' : 'off')}
          />
          <CCTile
            icon={<Moon size={14} />}
            label="Focus"
            sublabel={focusLabel}
            on={s.focusMode !== 'off'}
            onToggle={() => s.setFocusMode(s.focusMode === 'off' ? 'dnd' : 'off')}
          />
        </div>

        {/* Row 3: Keyboard brightness + Screen Mirroring */}
        <div className="grid grid-cols-2 gap-[6px]">
          <CCTile
            icon={<Monitor size={14} />}
            label="Screen Mirror"
            sublabel="Available"
            on={false}
          />
          <CCTile
            icon={<Lock size={14} />}
            label="Screen Lock"
            sublabel=""
            on={false}
          />
        </div>

      </div>

      <Divider />

      {/* Brightness */}
      <Slider
        value={s.brightness}
        onChange={s.setBrightness}
        icon={<Sun size={14} />}
      />

      <Divider />

      {/* Volume */}
      <Slider
        value={s.volume}
        onChange={s.setVolume}
        icon={s.volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
      />

      <Divider />

      {/* Now Playing mini */}
      <div className="px-4 py-[10px] flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-[7px] flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#8B1A3A,#FF2D6F)' }}
        >
          <Music2 size={16} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[12px] font-medium truncate">Blinding Lights</p>
          <p className="text-white/50 text-[11px] truncate">The Weeknd</p>
        </div>
        <div className="flex items-center gap-[10px]">
          <button
            onClick={() => {}}
            className="text-white/60 hover:text-white transition-colors cursor-default"
          >
            <SkipBack size={13} />
          </button>
          <button
            onClick={() => s.setIsPlaying(!s.isPlaying)}
            className="text-white hover:text-white/80 transition-colors cursor-default"
          >
            {s.isPlaying ? <Pause size={15} /> : <Play size={15} fill="white" />}
          </button>
          <button
            onClick={() => {}}
            className="text-white/60 hover:text-white transition-colors cursor-default"
          >
            <SkipForward size={13} />
          </button>
        </div>
      </div>

    </PanelWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wi-Fi Panel
// ─────────────────────────────────────────────────────────────────────────────

function WifiPanel({ s, rightEdge, topY, onClose }: { s: TraySharedState; rightEdge: number; topY: number; onClose: () => void }) {
  return (
    <PanelWrapper rightEdge={rightEdge} topY={topY} width={280} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
        <p className="text-white font-semibold text-[15px]">Wi-Fi</p>
        <Toggle on={s.wifiOn} onToggle={() => s.setWifiOn(!s.wifiOn)} />
      </div>

      {s.wifiOn && (
        <>
          <SectionLabel>My Networks</SectionLabel>

          {WIFI_NETWORKS.filter(n => n.connected).map(net => (
            <div
              key={net.ssid}
              className="flex items-center gap-3 px-4 py-[10px] cursor-default hover:bg-white/5 transition-colors"
            >
              <Check size={13} color="#32D74B" className="flex-shrink-0" />
              <span className="flex-1 text-white text-[13px]">{net.ssid}</span>
              <SignalBars strength={net.signal} />
              {net.secured && <Lock size={11} color="rgba(255,255,255,0.35)" />}
              <ChevronRight size={12} color="rgba(255,255,255,0.25)" />
            </div>
          ))}

          <Divider />
          <SectionLabel>Other Networks</SectionLabel>

          {WIFI_NETWORKS.filter(n => !n.connected).map(net => (
            <div
              key={net.ssid}
              className="flex items-center gap-3 px-4 py-[10px] cursor-default hover:bg-white/5 transition-colors"
            >
              <span className="w-[13px] flex-shrink-0" />
              <span className="flex-1 text-white/80 text-[13px]">{net.ssid}</span>
              <SignalBars strength={net.signal} />
              {net.secured && <Lock size={11} color="rgba(255,255,255,0.25)" />}
            </div>
          ))}
        </>
      )}

      {!s.wifiOn && (
        <div className="py-8 text-center">
          <WifiOff size={28} color="rgba(255,255,255,0.20)" className="mx-auto mb-2" />
          <p className="text-white/35 text-[13px]">Wi-Fi is turned off</p>
        </div>
      )}

      <Divider />
      <button className="w-full text-left px-4 py-[10px] text-[13px] text-white/70 hover:bg-white/5 cursor-default transition-colors">
        Wi-Fi Settings…
      </button>
    </PanelWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Battery Panel
// ─────────────────────────────────────────────────────────────────────────────

const BATTERY_PCT = 87;

function BatteryPanel({ s, rightEdge, topY, onClose }: { s: TraySharedState; rightEdge: number; topY: number; onClose: () => void }) {
  return (
    <PanelWrapper rightEdge={rightEdge} topY={topY} width={260} onClose={onClose}>
      {/* Big battery display */}
      <div className="px-5 py-5 flex items-center gap-4">
        {/* Battery icon */}
        <div className="relative flex-shrink-0">
          <div
            className="w-[56px] h-[26px] rounded-[5px] border-[2px] border-white/40 relative overflow-hidden"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-[3px]"
              style={{
                width: `${BATTERY_PCT}%`,
                background: BATTERY_PCT > 20 ? '#32D74B' : '#FF453A',
              }}
            />
          </div>
          {/* Battery tip */}
          <div
            className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-[3px] h-[12px] rounded-r-sm"
            style={{ background: 'rgba(255,255,255,0.40)' }}
          />
          <Zap
            size={11}
            className="absolute inset-0 m-auto"
            color="white"
            fill="white"
          />
        </div>

        <div>
          <p className="text-white text-[28px] font-semibold leading-none">{BATTERY_PCT}%</p>
          <p className="text-white/50 text-[12px] mt-0.5">Power Adapter</p>
        </div>
      </div>

      <Divider />

      {/* Low Power Mode */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <ZapOff size={14} color="rgba(255,255,255,0.60)" />
          <span className="text-white text-[13px]">Low Power Mode</span>
        </div>
        <Toggle on={s.lowPower} onToggle={() => s.setLowPower(!s.lowPower)} />
      </div>

      <Divider />

      {/* Options */}
      {[
        'Show Percentage in Menu Bar',
        'Battery Preferences…',
      ].map(label => (
        <button
          key={label}
          className="w-full text-left px-4 py-[10px] text-[13px] text-white/70 hover:bg-white/5 cursor-default transition-colors"
        >
          {label}
        </button>
      ))}
    </PanelWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Now Playing Panel
// ─────────────────────────────────────────────────────────────────────────────

const SONG = {
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours',
  duration: 200,
  progress: 0.34,
};

function NowPlayingPanel({ s, rightEdge, topY, onClose }: { s: TraySharedState; rightEdge: number; topY: number; onClose: () => void }) {
  const [progress, setProgress] = useState(SONG.progress);

  useEffect(() => {
    if (!s.isPlaying) return;
    const id = setInterval(() => {
      setProgress(p => {
        const next = p + 1 / SONG.duration;
        return next >= 1 ? 0 : next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [s.isPlaying]);

  const formatTime = (pct: number) => {
    const secs = Math.round(pct * SONG.duration);
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  };

  return (
    <PanelWrapper rightEdge={rightEdge} topY={topY} width={284} onClose={onClose}>
      {/* Album art */}
      <div className="px-4 pt-4">
        <div
          className="w-full rounded-[12px] flex items-center justify-center"
          style={{
            aspectRatio: '1',
            background: 'linear-gradient(135deg, #8B1A3A 0%, #C41E5A 50%, #FF2D6F 100%)',
          }}
        >
          <Music2 size={72} color="rgba(255,255,255,0.35)" />
        </div>
      </div>

      {/* Song info */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-white font-semibold text-[16px] truncate">{SONG.title}</p>
            <p className="text-white/55 text-[14px] truncate">{SONG.artist}</p>
          </div>
          <button className="text-white/30 hover:text-white/60 transition-colors ml-2 mt-0.5 cursor-default flex-shrink-0">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-2">
        <div
          className="relative h-[3px] rounded-full bg-white/15 cursor-pointer"
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-white/30">{formatTime(progress)}</span>
          <span className="text-[10px] text-white/30">−{formatTime(1 - progress)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-9 px-4 py-3">
        <button
          onClick={() => setProgress(0)}
          className="text-white/60 hover:text-white transition-colors cursor-default"
        >
          <SkipBack size={22} fill="rgba(255,255,255,0.6)" />
        </button>
        <button
          onClick={() => s.setIsPlaying(!s.isPlaying)}
          className="text-white hover:text-white/80 transition-colors cursor-default"
        >
          {s.isPlaying
            ? <Pause size={36} fill="white" />
            : <Play size={36} fill="white" />}
        </button>
        <button
          onClick={() => setProgress(0)}
          className="text-white/60 hover:text-white transition-colors cursor-default"
        >
          <SkipForward size={22} fill="rgba(255,255,255,0.6)" />
        </button>
      </div>

      {/* Volume */}
      <div className="pb-3">
        <Slider
          value={s.volume}
          onChange={s.setVolume}
          icon={s.volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
        />
      </div>
    </PanelWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Focus Panel
// ─────────────────────────────────────────────────────────────────────────────

const FOCUS_OPTIONS = [
  { id: 'off',   label: 'Off',             sub: 'No focus active',        iconBg: 'rgba(255,255,255,0.12)', icon: <X size={14} /> },
  { id: 'dnd',   label: 'Do Not Disturb',  sub: 'Until turned off',       iconBg: '#636366', icon: <Moon size={14} /> },
  { id: 'work',  label: 'Work',            sub: 'Until 6:00 PM',          iconBg: '#0A84FF', icon: <Laptop size={14} /> },
  { id: 'sleep', label: 'Sleep',           sub: 'Until 8:00 AM',          iconBg: '#5E5CE6', icon: <Moon size={14} /> },
] as const;

function FocusPanel({ s, rightEdge, topY, onClose }: { s: TraySharedState; rightEdge: number; topY: number; onClose: () => void }) {
  return (
    <PanelWrapper rightEdge={rightEdge} topY={topY} width={280} onClose={onClose}>
      <div className="px-4 pt-4 pb-2">
        <p className="text-white font-semibold text-[15px]">Focus</p>
        <p className="text-white/45 text-[12px] mt-0.5">
          {s.focusMode === 'off' ? 'No focus is active' : `${FOCUS_OPTIONS.find(f => f.id === s.focusMode)?.label} is on`}
        </p>
      </div>

      <div className="px-3 pb-3 space-y-[4px]">
        {FOCUS_OPTIONS.map(opt => {
          const active = s.focusMode === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => { s.setFocusMode(opt.id as typeof s.focusMode); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[11px] cursor-default transition-colors"
              style={{ background: active ? 'rgba(255,255,255,0.12)' : 'transparent' }}
            >
              <div
                className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: opt.iconBg }}
              >
                <span className="text-white flex">{opt.icon}</span>
              </div>
              <div className="text-left flex-1">
                <p className="text-white text-[13px] font-medium">{opt.label}</p>
                <p className="text-white/45 text-[11px]">{opt.sub}</p>
              </div>
              {active && <Check size={14} color="#32D74B" />}
            </button>
          );
        })}
      </div>
    </PanelWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Spotlight Overlay — proper two-panel macOS layout
// ─────────────────────────────────────────────────────────────────────────────

interface SpItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  iconBg: string;
  iconFn: (sz: number) => React.ReactNode;
  description: string;
  action: string;
}

function SpIcon({ bg, sz, fn }: { bg: string; sz: number; fn: (sz: number) => React.ReactNode }) {
  const r = Math.round(sz * 0.225);
  return (
    <div style={{
      width: sz, height: sz, borderRadius: r, background: bg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: sz > 40 ? '0 6px 24px rgba(0,0,0,0.50)' : undefined,
    }}>
      {fn(Math.round(sz * 0.46))}
    </div>
  );
}

const GH_SVG = (sz: number) => (
  <svg viewBox="0 0 24 24" width={sz} height={sz} fill="white">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LI_SVG = (sz: number) => (
  <svg viewBox="0 0 24 24" width={sz} height={sz} fill="white">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IG_SVG = (sz: number) => (
  <svg viewBox="0 0 24 24" width={sz} height={sz} fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const SP_ITEMS: SpItem[] = [
  {
    id: 'terminal', category: 'Applications',
    title: 'Terminal', subtitle: 'Utility Application',
    iconBg: '#1A1A1A',
    iconFn: (sz) => (
      <span style={{ fontFamily: 'monospace', color: '#00FF41', fontSize: sz, fontWeight: 700, lineHeight: 1, userSelect: 'none' }}>{'>'}_</span>
    ),
    description: 'Interactive command-line. Run help, whoami, skills, projects, neofetch and more. Arrow keys for history.',
    action: 'Open',
  },
  {
    id: 'finder', category: 'Applications',
    title: 'Finder', subtitle: 'File Manager',
    iconBg: 'linear-gradient(155deg, #42AAE3 0%, #1A78C2 100%)',
    iconFn: (sz) => <Folder size={sz} color="white" fill="white" />,
    description: 'Browse the portfolio file system. Navigate projects, documents, and resources in a two-panel view.',
    action: 'Open',
  },
  {
    id: 'settings', category: 'Applications',
    title: 'System Settings', subtitle: 'Preferences',
    iconBg: 'linear-gradient(155deg, #8E8E93 0%, #48484A 100%)',
    iconFn: (sz) => <Settings size={sz} color="white" />,
    description: 'Configure Wi-Fi, Bluetooth, Focus, appearance, notifications, sound, and system preferences.',
    action: 'Open',
  },
  {
    id: 'safari', category: 'Applications',
    title: 'Safari', subtitle: 'Web Browser',
    iconBg: 'linear-gradient(155deg, #1A96E8 0%, #0055CC 100%)',
    iconFn: (sz) => <Globe size={sz} color="white" />,
    description: 'Browse the web inside the portfolio. Opens Google — fast, private, and seamless.',
    action: 'Open',
  },
  {
    id: 'github', category: 'Portfolio',
    title: 'GitHub', subtitle: 'github.com/Aryan-en',
    iconBg: '#161B22',
    iconFn: GH_SVG,
    description: 'View open-source projects and repositories. Stars, forks, top languages, and contribution activity.',
    action: 'Open',
  },
  {
    id: 'linkedin', category: 'Portfolio',
    title: 'LinkedIn', subtitle: 'Aryan Singh · Software Engineer',
    iconBg: '#0A66C2',
    iconFn: LI_SVG,
    description: 'Professional profile with work experience, education, skills, and endorsements.',
    action: 'Open',
  },
  {
    id: 'leetcode', category: 'Portfolio',
    title: 'LeetCode', subtitle: 'Competitive Programming',
    iconBg: '#FFA116',
    iconFn: (sz) => (
      <span style={{ fontSize: sz * 0.9, fontWeight: 900, color: 'white', lineHeight: 1, userSelect: 'none', fontFamily: 'monospace' }}>LC</span>
    ),
    description: '372+ problems solved. Easy: 121 · Medium: 213 · Hard: 38. Top 15% globally.',
    action: 'Open',
  },
  {
    id: 'instagram', category: 'Portfolio',
    title: 'Instagram', subtitle: '@aryaan.uu',
    iconBg: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)',
    iconFn: IG_SVG,
    description: 'Personal updates, photography, and behind-the-scenes moments. Follow along.',
    action: 'Open',
  },
];

interface SpotlightProps {
  onClose: () => void;
}

export function SpotlightOverlay({ onClose }: SpotlightProps) {
  const [query, setQuery]         = useState('');
  const [selectedIdx, setSelIdx]  = useState(0);
  const inputRef                  = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Filter items
  const filtered: SpItem[] = query.trim()
    ? SP_ITEMS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    : SP_ITEMS;

  // Reset selection when results change
  useEffect(() => { setSelIdx(0); }, [query]);

  // Group by category
  const grouped = filtered.reduce<{ cat: string; items: SpItem[] }[]>((acc, item) => {
    const g = acc.find(x => x.cat === item.category);
    if (g) g.items.push(item); else acc.push({ cat: item.category, items: [item] });
    return acc;
  }, []);

  const selected = filtered[selectedIdx] ?? null;

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelIdx(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelIdx(i => Math.max(i - 1, 0)); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, filtered.length]);

  return ReactDOM.createPortal(
    <>
      {/* Scrim */}
      <motion.div
        className="fixed inset-0"
        style={{ zIndex: 9997, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onMouseDown={onClose}
      />

      {/* Spotlight panel */}
      <motion.div
        className="fixed left-1/2 overflow-hidden"
        style={{
          zIndex: 9998,
          top: '20vh',
          width: 680,
          transform: 'translateX(-50%)',
          borderRadius: 13,
          background: 'rgba(22, 22, 26, 0.95)',
          backdropFilter: 'blur(80px) saturate(2)',
          WebkitBackdropFilter: 'blur(80px) saturate(2)',
          boxShadow: '0 36px 130px rgba(0,0,0,0.85), inset 0 0 0 0.5px rgba(255,255,255,0.10)',
        }}
        initial={{ opacity: 0, scale: 0.96, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.17, ease: [0.25, 0.1, 0.25, 1] }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* ── Search bar ─────────────────────────────────────── */}
        <div
          className="flex items-center gap-3 px-4 py-[13px]"
          style={{ borderBottom: filtered.length > 0 ? '0.5px solid rgba(255,255,255,0.09)' : 'none' }}
        >
          <Search size={22} strokeWidth={2.2} color="rgba(255,255,255,0.32)" className="flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Spotlight Search"
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent text-white outline-none leading-none"
            style={{ fontSize: 22, fontWeight: 300 }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="w-[22px] h-[22px] rounded-full flex items-center justify-center cursor-default flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.14)' }}
            >
              <X size={12} color="white" />
            </button>
          )}
        </div>

        {/* ── Two-panel results ──────────────────────────────── */}
        {filtered.length > 0 && (
          <div className="flex" style={{ height: 320 }}>

            {/* Left: categorised list */}
            <div
              className="overflow-y-auto py-[6px] flex-shrink-0"
              style={{ width: 234, borderRight: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              {grouped.map(group => (
                <div key={group.cat}>
                  <p className="px-[14px] pt-[10px] pb-[3px] text-[10px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: 'rgba(255,255,255,0.30)' }}>
                    {group.cat}
                  </p>
                  {group.items.map(item => {
                    const idx = filtered.indexOf(item);
                    const isSel = idx === selectedIdx;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-[9px] mx-[5px] px-[9px] py-[5px] rounded-[8px] cursor-default"
                        style={{ background: isSel ? '#3577DB' : 'transparent' }}
                        onMouseEnter={() => setSelIdx(idx)}
                      >
                        <SpIcon bg={item.iconBg} sz={26} fn={item.iconFn} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-[500] leading-[1.2] truncate"
                            style={{ color: isSel ? 'white' : 'rgba(255,255,255,0.88)' }}>
                            {item.title}
                          </p>
                          <p className="text-[11px] leading-[1.2] truncate"
                            style={{ color: isSel ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.32)' }}>
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Right: preview pane */}
            {selected && (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <SpIcon bg={selected.iconBg} sz={84} fn={selected.iconFn} />
                <p className="text-white font-semibold text-[20px] mt-4 leading-tight">{selected.title}</p>
                <p className="text-[13px] mt-[5px]" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  {selected.subtitle}
                </p>
                <p className="text-[13px] mt-4 leading-[1.6] max-w-[260px]" style={{ color: 'rgba(255,255,255,0.52)' }}>
                  {selected.description}
                </p>
                <button
                  className="mt-5 px-5 py-[7px] rounded-[8px] text-white text-[13px] font-medium cursor-default transition-opacity hover:opacity-90"
                  style={{ background: '#3577DB' }}
                >
                  {selected.action}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty hint (only shown when query is empty and no results somehow) */}
        {!query && filtered.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.20)' }}>
              Type to search your portfolio
            </p>
          </div>
        )}
      </motion.div>
    </>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Clock / Calendar Panel
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function buildCalendar(year: number, month: number) {
  const firstDay  = new Date(year, month, 1).getDay();   // 0=Sun
  const daysInMon = new Date(year, month + 1, 0).getDate();
  const daysInPrev= new Date(year, month, 0).getDate();

  const cells: { day: number; current: boolean }[] = [];

  // Trailing days from prev month
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, current: false });

  // Days of current month
  for (let d = 1; d <= daysInMon; d++)
    cells.push({ day: d, current: true });

  // Leading days from next month
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++)
    cells.push({ day: d, current: false });

  return cells;
}

function ClockPanel({ rightEdge, topY, onClose }: { rightEdge: number; topY: number; onClose: () => void }) {
  const now      = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const today    = now.getDate();
  const isToday  = (y: number, m: number, d: number) => y === now.getFullYear() && m === now.getMonth() && d === today;
  const cells    = buildCalendar(view.year, view.month);

  const prevMonth = () => {
    setView(v => {
      const d = new Date(v.year, v.month - 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const nextMonth = () => {
    setView(v => {
      const d = new Date(v.year, v.month + 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const [time, setTime] = useState(() => now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <PanelWrapper rightEdge={rightEdge} topY={topY} width={260} onClose={onClose}>
      {/* Large time */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-white text-[38px] font-semibold leading-none tracking-[-1px]" suppressHydrationWarning>
          {time.replace(/^0/, '')}
        </p>
        <p className="text-white/45 text-[13px] mt-1">
          {now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <Divider />

      {/* Calendar header */}
      <div className="flex items-center justify-between px-4 py-2">
        <button onClick={prevMonth} className="text-white/50 hover:text-white cursor-default p-1 rounded hover:bg-white/10">
          <ChevronLeft size={14} />
        </button>
        <p className="text-white text-[13px] font-medium">
          {MONTH_NAMES[view.month]} {view.year}
        </p>
        <button onClick={nextMonth} className="text-white/50 hover:text-white cursor-default p-1 rounded hover:bg-white/10">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-3 pb-1">
        {DAY_HEADERS.map((d, i) => (
          <div key={i} className="text-center text-[11px] font-medium text-white/35 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 px-3 pb-4">
        {cells.map((cell, i) => {
          const highlight = cell.current && isToday(view.year, view.month, cell.day);
          return (
            <div
              key={i}
              className="flex items-center justify-center py-[3px] cursor-default"
            >
              <span
                className="w-[26px] h-[26px] flex items-center justify-center rounded-full text-[13px] transition-colors"
                style={{
                  background: highlight ? '#0A84FF' : 'transparent',
                  color: highlight
                    ? 'white'
                    : cell.current
                    ? 'rgba(255,255,255,0.85)'
                    : 'rgba(255,255,255,0.22)',
                  fontWeight: highlight ? 600 : 400,
                }}
              >
                {cell.day}
              </span>
            </div>
          );
        })}
      </div>
    </PanelWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main TrayPanels export — renders the active panel via AnimatePresence
// ─────────────────────────────────────────────────────────────────────────────

interface TrayPanelsProps {
  panel: TrayPanelState | null;
  spotlight: boolean;
  onClose: () => void;
}

export function TrayPanels({ panel, spotlight, onClose }: TrayPanelsProps) {
  // Shared interactive state
  const [wifiOn,       setWifiOn]       = useState(true);
  const [bluetoothOn,  setBluetoothOn]  = useState(true);
  const [airdropMode,  setAirdropMode]  = useState<'off'|'contacts'|'everyone'>('contacts');
  const [focusMode,    setFocusMode]    = useState<'off'|'dnd'|'work'|'sleep'>('off');
  const [brightness,   setBrightness]   = useState(80);
  const [volume,       setVolume]       = useState(62);
  const [lowPower,     setLowPower]     = useState(false);
  const [isPlaying,    setIsPlaying]    = useState(false);

  const s: TraySharedState = {
    wifiOn, setWifiOn, bluetoothOn, setBluetoothOn,
    airdropMode, setAirdropMode, focusMode, setFocusMode,
    brightness, setBrightness, volume, setVolume,
    lowPower, setLowPower, isPlaying, setIsPlaying,
  };

  return (
    <>
      <AnimatePresence>
        {spotlight && <SpotlightOverlay key="spotlight" onClose={onClose} />}
      </AnimatePresence>

      <AnimatePresence>
        {panel?.id === 'controlcenter' && (
          <ControlCenterPanel key="cc" s={s} rightEdge={panel.rightEdge} topY={panel.topY} onClose={onClose} />
        )}
        {panel?.id === 'wifi' && (
          <WifiPanel key="wifi" s={s} rightEdge={panel.rightEdge} topY={panel.topY} onClose={onClose} />
        )}
        {panel?.id === 'battery' && (
          <BatteryPanel key="battery" s={s} rightEdge={panel.rightEdge} topY={panel.topY} onClose={onClose} />
        )}
        {panel?.id === 'nowplaying' && (
          <NowPlayingPanel key="nowplaying" s={s} rightEdge={panel.rightEdge} topY={panel.topY} onClose={onClose} />
        )}
        {panel?.id === 'focus' && (
          <FocusPanel key="focus" s={s} rightEdge={panel.rightEdge} topY={panel.topY} onClose={onClose} />
        )}
        {panel?.id === 'clock' && (
          <ClockPanel key="clock" rightEdge={panel.rightEdge} topY={panel.topY} onClose={onClose} />
        )}
      </AnimatePresence>
    </>
  );
}
