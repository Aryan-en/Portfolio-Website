"use client";

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrayPanels, type TrayPanelState, type TrayPanelId } from './TrayPanels';
import {
  Sparkles, Moon, Play, Wifi, BatteryMedium, Search, LayoutGrid,
  FolderPlus, Settings, X, Info, Pencil, Eye, Printer, Share2,
  Trash2, Tag, Scissors, Copy, Link, Archive, ChevronRight,
  List, Columns, Image, ChevronLeft, Mic, Smile, Minus, HelpCircle,
  Folder, Download, Home, Globe, Cloud, Check, MonitorSpeaker,
} from 'lucide-react';
import { AppleLogo } from './AppleLogo';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type DropdownEntry =
  | { type: 'item'; label: string; shortcut?: string; icon?: React.ReactNode; disabled?: boolean; hasSubmenu?: boolean; checked?: boolean }
  | { type: 'divider' }
  | { type: 'colors' };

// ─────────────────────────────────────────────────────────────────────────────
// Icon helpers
// ─────────────────────────────────────────────────────────────────────────────

const IC = (el: React.ReactNode) => (
  <span className="w-[14px] h-[14px] flex items-center justify-center flex-shrink-0">{el}</span>
);
const LI = (C: React.ComponentType<{ size?: number; strokeWidth?: number }>) =>
  IC(<C size={13} strokeWidth={1.7} />);

// Custom SVG icons
const EjectSVG   = IC(<svg viewBox="0 0 13 13" fill="none" width="13" height="13"><path d="M6.5 2L12 9H1L6.5 2Z" fill="currentColor"/><rect x="1" y="10.5" width="11" height="1.5" rx=".75" fill="currentColor"/></svg>);
const NewWinSVG  = IC(<svg viewBox="0 0 13 13" fill="none" width="13" height="13"><rect x="1" y="3" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="3" width="11" height="2.5" rx="1" fill="currentColor" fillOpacity=".35"/><path d="M4 7.5h5M6.5 5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const UpArrowSVG = IC(<svg viewBox="0 0 13 13" fill="none" width="13" height="13"><path d="M6.5 10V3M3 6.5L6.5 3 10 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const ClipSVG    = IC(<svg viewBox="0 0 13 13" fill="none" width="13" height="13"><rect x="2.5" y="2" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="4.5" y="1" width="4" height="2" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>);
const PasteSVG   = IC(<svg viewBox="0 0 13 13" fill="none" width="13" height="13"><rect x="2" y="2" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="4" y="1" width="5" height="2" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 6h4M4.5 8.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>);
const CompSVG    = IC(<svg viewBox="0 0 13 13" fill="none" width="13" height="13"><path d="M2 10.5L5 7.5M8 4.5L11 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><rect x="1" y="7.5" width="4" height="4" rx=".75" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="1" width="4" height="4" rx=".75" stroke="currentColor" strokeWidth="1.3"/></svg>);
const AliasSVG   = IC(<svg viewBox="0 0 13 13" fill="none" width="13" height="13"><path d="M7 2h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M11 2L6 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><rect x="1" y="6" width="7" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>);
const DocSVG     = IC(<svg viewBox="0 0 13 14" fill="none" width="13" height="14"><path d="M2 2.5A1.5 1.5 0 013.5 1h4.5l3 3v8A1.5 1.5 0 019.5 13h-6A1.5 1.5 0 012 11.5v-9z" stroke="currentColor" strokeWidth="1.4"/><path d="M7.5 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>);
const CompuSVG   = IC(<svg viewBox="0 0 13 13" fill="none" width="13" height="13"><rect x="1" y="2" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 11h5M6.5 10v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>);

// Lucide-based icon shortcuts
const FPlusI  = LI(FolderPlus);
const SettI   = LI(Settings);
const InfoI   = LI(Info);
const PencilI = LI(Pencil);
const EyeI    = LI(Eye);
const PrintI  = LI(Printer);
const ShareI  = LI(Share2);
const TrashI  = LI(Trash2);
const TagI    = LI(Tag);
const FindI   = LI(Search);
const CutI    = LI(Scissors);
const CopyI   = LI(Copy);
const LinkI   = LI(Link);
const MicI    = LI(Mic);
const SmileI  = LI(Smile);
const ColI    = LI(Columns);
const ImgI    = LI(Image);
const BackI   = LI(ChevronLeft);
const HelpI   = LI(HelpCircle);
const DLI     = LI(Download);
const HomeI   = LI(Home);
const GlobeI  = LI(Globe);
const FolI    = LI(Folder);
const CloudI  = LI(Cloud);
const CheckI  = LI(Check);
const ListI   = LI(List);
const GridI   = LI(LayoutGrid);
const MonI    = LI(MonitorSpeaker);

// ─────────────────────────────────────────────────────────────────────────────
// Tag colours
// ─────────────────────────────────────────────────────────────────────────────

const TAG_COLORS = ['#FF605C', '#FF9F0A', '#FFD60A', '#32D74B', '#0A84FF', '#BF5AF2', '#8E8E93'];

// ─────────────────────────────────────────────────────────────────────────────
// Menu definitions
// ─────────────────────────────────────────────────────────────────────────────

const I = (label: string, opts: Omit<Extract<DropdownEntry, { type: 'item' }>, 'type' | 'label'> = {}): DropdownEntry =>
  ({ type: 'item', label, ...opts });
const D: DropdownEntry  = { type: 'divider' };
const C: DropdownEntry  = { type: 'colors' };

const MENUS: Record<string, { items: DropdownEntry[]; width: number }> = {
  File: {
    width: 384,
    items: [
      I('New Finder Window',         { shortcut: '⌘N',   icon: NewWinSVG }),
      I('New Folder',                 { shortcut: '⇧⌘N',  icon: FPlusI }),
      I('New Folder with Selection',  { shortcut: '^⌘N',  icon: FPlusI, disabled: true }),
      I('New Smart Folder',           {                    icon: SettI }),
      I('New Tab',                    { shortcut: '⌘T',   icon: IC(<svg viewBox="0 0 13 10" fill="none" width="13" height="10"><rect x="1" y="3" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 1h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>) }),
      D,
      I('Open',        { shortcut: '⌘O',  disabled: true }),
      I('Open With',   {                   disabled: true, hasSubmenu: true }),
      I('Close Window',{ shortcut: '⌘W',  icon: IC(<X size={12} strokeWidth={2.5} />) }),
      D,
      I('Get Info',    { shortcut: '⌘I',  icon: InfoI }),
      D,
      I('Rename',      {                   disabled: true, icon: PencilI }),
      I('Compress',    {                   disabled: true, icon: CompSVG }),
      I('Duplicate',   { shortcut: '⌘D',  disabled: true, icon: CopyI }),
      I('Make Alias',  { shortcut: '^⌘A', disabled: true, icon: AliasSVG }),
      I('Quick Look',  { shortcut: '⌘Y',  disabled: true, icon: EyeI }),
      I('Print',       { shortcut: '⌘P',  disabled: true, icon: PrintI }),
      D,
      I('Share…',                  { disabled: true, icon: ShareI }),
      I('Manage Shared File…',     { disabled: true, icon: CloudI }),
      D,
      I('Show Original', { shortcut: '⌘R',    disabled: true }),
      I('Add to Dock',   { shortcut: '^⇧⌘T', disabled: true }),
      D,
      I('Move to Bin',   { shortcut: '⌘⌫',  disabled: true, icon: TrashI }),
      I('Eject',         { shortcut: '⌘E',   disabled: true, icon: EjectSVG }),
      D,
      C,
      I('Tags…', { icon: TagI }),
      D,
      I('Find', { shortcut: '⌘F', icon: FindI }),
    ],
  },
  Edit: {
    width: 252,
    items: [
      I('Undo',        { shortcut: '⌘Z',  disabled: true }),
      I('Redo',        { shortcut: '⇧⌘Z', disabled: true }),
      D,
      I('Cut',         { shortcut: '⌘X',  disabled: true, icon: CutI }),
      I('Copy',        { shortcut: '⌘C',  disabled: true, icon: CopyI }),
      I('Paste',       { shortcut: '⌘V',  disabled: true, icon: PasteSVG }),
      I('Select All',  { shortcut: '⌘A' }),
      D,
      I('Show Clipboard', { disabled: true, icon: ClipSVG }),
      D,
      I('Start Dictation', { icon: MicI }),
      I('Emoji & Symbols', { shortcut: '^⌘Space', icon: SmileI }),
    ],
  },
  View: {
    width: 264,
    items: [
      I('as Icons',    { shortcut: '⌘1', icon: GridI }),
      I('as List',     { shortcut: '⌘2', icon: ListI }),
      I('as Columns',  { shortcut: '⌘3', icon: ColI }),
      I('as Gallery',  { shortcut: '⌘4', icon: ImgI }),
      D,
      I('Use Groups',     { shortcut: '⌃⌘0' }),
      I('Sort By',        { hasSubmenu: true }),
      D,
      I('Clean Up',       { disabled: true }),
      I('Clean Up By',    { disabled: true, hasSubmenu: true }),
      D,
      I('Hide Toolbar',    { shortcut: '⌥⌘T' }),
      I('Show Tab Bar',    { shortcut: '⇧⌘T' }),
      I('Show Path Bar',   { shortcut: '⌥⌘P' }),
      I('Show Status Bar', { shortcut: '⌘/' }),
      D,
      I('Hide Preview',       { shortcut: '⇧⌘P' }),
      I('Customise Toolbar…'),
      D,
      I('Show View Options', { shortcut: '⌘J' }),
    ],
  },
  Go: {
    width: 272,
    items: [
      I('Back',              { shortcut: '⌘[',   icon: BackI }),
      I('Forward',           { shortcut: '⌘]',   icon: IC(<ChevronRight size={13} strokeWidth={1.7} />) }),
      I('Enclosing Folder',  { shortcut: '⌘↑',   icon: UpArrowSVG }),
      D,
      I('Recents',           { hasSubmenu: true }),
      D,
      I('Documents',         { shortcut: '⇧⌘O', icon: DocSVG }),
      I('Desktop',           { shortcut: '⇧⌘D', icon: MonI }),
      I('Downloads',         { shortcut: '⌥⌘L', icon: DLI }),
      I('Home',              { shortcut: '⇧⌘H', icon: HomeI }),
      I('Computer',          { shortcut: '⇧⌘C', icon: CompuSVG }),
      I('AirDrop',           { shortcut: '⇧⌘R', icon: IC(<Wifi size={13} strokeWidth={1.7} />) }),
      I('Network',           { shortcut: '⇧⌘K', icon: GlobeI }),
      I('iCloud Drive',      { shortcut: '⇧⌘I', icon: CloudI }),
      I('Applications',      { shortcut: '⇧⌘A', icon: FolI }),
      I('Utilities',         { shortcut: '⇧⌘U', icon: FolI }),
      D,
      I('Recent Folders',    { disabled: true, hasSubmenu: true }),
      D,
      I('Go to Folder…',      { shortcut: '⇧⌘G' }),
      I('Connect to Server…', { shortcut: '⌘K' }),
    ],
  },
  Window: {
    width: 248,
    items: [
      I('Minimise',                             { shortcut: '⌘M',  icon: IC(<Minus size={13} strokeWidth={2} />) }),
      I('Zoom'),
      I('Move Window to Left Side of Screen'),
      I('Move Window to Right Side of Screen'),
      D,
      I('Bring All to Front'),
      D,
      I("Aryan's Portfolio", { checked: true, icon: CheckI }),
    ],
  },
  Help: {
    width: 204,
    items: [
      I('macOS Help', { shortcut: '⌘?', icon: HelpI }),
    ],
  },
};

const MENU_KEYS = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Dropdown — rendered via portal into document.body
// ─────────────────────────────────────────────────────────────────────────────

interface DropdownProps {
  menuKey: string;
  x: number;
  y: number;
  onClose: () => void;
}

function DropdownPortal({ menuKey, x, y, onClose }: DropdownProps) {
  const { items, width } = MENUS[menuKey];
  const [hov, setHov]   = useState<number | null>(null);

  // Keep dropdown on-screen horizontally
  const safeX = typeof window !== 'undefined'
    ? Math.min(x, window.innerWidth - width - 6)
    : x;

  return ReactDOM.createPortal(
    <>
      {/* Invisible backdrop — catches click-outside */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 9998 }}
        onMouseDown={onClose}
      />

      {/* Dropdown panel */}
      <motion.div
        key={menuKey}
        initial={{ opacity: 0, scale: 0.97, y: -6 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.96, y: -4  }}
        transition={{ duration: 0.11, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed rounded-[11px] py-[5px] overflow-hidden"
        style={{
          left: safeX,
          top: y,
          width,
          zIndex: 9999,
          background: 'rgba(28, 28, 30, 0.90)',
          backdropFilter: 'blur(48px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(48px) saturate(1.8)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.65), 0 6px 24px rgba(0,0,0,0.40), inset 0 0 0 0.5px rgba(255,255,255,0.10)',
          transformOrigin: 'top left',
        }}
        onMouseDown={e => e.stopPropagation()} // don't let clicks bubble to backdrop
      >
        {items.map((entry, i) => {
          if (entry.type === 'divider') {
            return (
              <div
                key={i}
                style={{ height: 1, background: 'rgba(255,255,255,0.10)', margin: '3px 10px' }}
              />
            );
          }

          if (entry.type === 'colors') {
            return (
              <div key={i} className="flex items-center gap-[9px] px-[14px] py-[6px]">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c}
                    onMouseDown={onClose}
                    className="w-[18px] h-[18px] rounded-full flex-shrink-0 cursor-default transition-transform duration-100 hover:scale-110"
                    style={{ background: c, boxShadow: '0 1px 3px rgba(0,0,0,0.35)' }}
                  />
                ))}
              </div>
            );
          }

          const active = hov === i;
          const dim    = entry.disabled;

          return (
            <div
              key={i}
              className="flex items-center gap-[7px] px-[10px] cursor-default rounded-[6px] mx-[4px] transition-none"
              style={{
                height: 26,
                background: active && !dim ? '#3577DB' : 'transparent',
                opacity: dim ? 0.37 : 1,
              }}
              onMouseEnter={() => !dim && setHov(i)}
              onMouseLeave={() => setHov(null)}
              onMouseDown={() => { if (!dim) onClose(); }}
            >
              {/* Icon slot */}
              <span
                className="w-[14px] flex-shrink-0 flex items-center justify-center"
                style={{ color: active ? 'white' : 'rgba(255,255,255,0.75)' }}
              >
                {entry.icon ?? null}
              </span>

              {/* Label */}
              <span
                className="flex-1 text-[13px] leading-none truncate"
                style={{ color: active ? 'white' : 'rgba(255,255,255,0.90)' }}
              >
                {entry.label}
              </span>

              {/* Right: shortcut or submenu chevron */}
              {entry.hasSubmenu ? (
                <ChevronRight size={11} strokeWidth={2.5}
                  color={active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.38)'} />
              ) : entry.shortcut ? (
                <span
                  className="text-[11px] flex-shrink-0 leading-none"
                  style={{ color: active ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.38)' }}
                >
                  {entry.shortcut}
                </span>
              ) : null}
            </div>
          );
        })}
      </motion.div>
    </>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Clock
// ─────────────────────────────────────────────────────────────────────────────

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function formatMacTime(d: Date) {
  const day  = DAYS[d.getDay()];
  const date = d.getDate();
  const mon  = MONTHS[d.getMonth()];
  const rawH = d.getHours();
  const ampm = rawH >= 12 ? 'PM' : 'AM';
  const h    = rawH % 12 || 12;
  const m    = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${date} ${mon}  ${h}:${m} ${ampm}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tray icon
// ─────────────────────────────────────────────────────────────────────────────

function TrayIcon({
  children, label, onClick, active,
}: {
  children: React.ReactNode; label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center px-1.5 py-0.5 rounded transition-colors duration-150 cursor-default"
      style={{ background: active ? 'rgba(255,255,255,0.18)' : 'transparent' }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MenuBar
// ─────────────────────────────────────────────────────────────────────────────

interface MenuState { key: string; x: number; y: number }

export function MenuBar() {
  const [time, setTime]           = useState<string | null>(null);
  const [menu, setMenu]           = useState<MenuState | null>(null);
  const [portalReady, setPortal]  = useState(false);
  const [trayPanel, setTrayPanel] = useState<TrayPanelState | null>(null);
  const [spotlight, setSpotlight] = useState(false);
  const buttonRefs                = useRef<Record<string, HTMLButtonElement | null>>({});

  // Clock
  useEffect(() => {
    setTime(formatMacTime(new Date()));
    const id = setInterval(() => setTime(formatMacTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  // Portal is only available client-side
  useEffect(() => { setPortal(true); }, []);

  // Escape to close
  useEffect(() => {
    if (!menu) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [menu]);

  const openMenu = (key: string, btn: HTMLButtonElement) => {
    const rect = btn.getBoundingClientRect();
    setMenu({ key, x: rect.left, y: rect.bottom });
  };

  const handleClick = (key: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (menu?.key === key) { setMenu(null); return; }
    openMenu(key, e.currentTarget);
  };

  const handleHover = (key: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (menu && menu.key !== key) openMenu(key, e.currentTarget);
  };

  const openTray = (id: TrayPanelId, btn: HTMLElement) => {
    const rect = btn.getBoundingClientRect();
    if (trayPanel?.id === id) { setTrayPanel(null); return; }
    setMenu(null);
    setSpotlight(false);
    setTrayPanel({ id, rightEdge: rect.right, topY: rect.bottom });
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full h-7 flex items-center justify-between backdrop-blur-xl bg-black/30 border-b border-white/[0.08] text-white text-[13px] select-none">

        {/* ── Left ── */}
        <div className="flex items-center h-full">

          <button
            aria-label="Apple menu"
            className="flex items-center justify-center h-full px-3 hover:bg-white/10 transition-colors duration-150"
          >
            <AppleLogo size={15} color="white" aria-hidden />
          </button>

          <button className="flex items-center h-full px-2.5 font-semibold hover:bg-white/10 transition-colors duration-150 tracking-[-0.01em]">
            Aryan&apos;s Portfolio
          </button>

          {MENU_KEYS.map((key) => (
            <button
              key={key}
              ref={el => { buttonRefs.current[key] = el; }}
              onClick={(e) => handleClick(key, e)}
              onMouseEnter={(e) => handleHover(key, e)}
              className="flex items-center h-full px-2.5 font-normal transition-colors duration-100 cursor-default"
              style={{
                color: 'rgba(255,255,255,0.90)',
                background: menu?.key === key ? 'rgba(255,255,255,0.18)' : 'transparent',
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* ── Right: tray icons + clock ── */}
        <div className="flex items-center h-full pr-1">

          {/* Siri — no panel, just sparkle */}
          <TrayIcon label="Siri">
            <Sparkles size={13} strokeWidth={1.75} />
          </TrayIcon>

          {/* Focus */}
          <TrayIcon
            label="Focus"
            active={trayPanel?.id === 'focus'}
            onClick={e => openTray('focus', e.currentTarget)}
          >
            <Moon size={13} strokeWidth={1.75} />
          </TrayIcon>

          {/* Now Playing */}
          <TrayIcon
            label="Now Playing"
            active={trayPanel?.id === 'nowplaying'}
            onClick={e => openTray('nowplaying', e.currentTarget)}
          >
            <Play size={12} strokeWidth={2} fill="white" />
          </TrayIcon>

          {/* Wi-Fi */}
          <TrayIcon
            label="Wi-Fi"
            active={trayPanel?.id === 'wifi'}
            onClick={e => openTray('wifi', e.currentTarget)}
          >
            <Wifi size={13} strokeWidth={1.75} />
          </TrayIcon>

          {/* Battery */}
          <TrayIcon
            label="Battery"
            active={trayPanel?.id === 'battery'}
            onClick={e => openTray('battery', e.currentTarget)}
          >
            <BatteryMedium size={15} strokeWidth={1.5} />
          </TrayIcon>

          {/* Spotlight */}
          <TrayIcon
            label="Spotlight"
            active={spotlight}
            onClick={() => { setTrayPanel(null); setSpotlight(s => !s); }}
          >
            <Search size={13} strokeWidth={1.75} />
          </TrayIcon>

          {/* Control Centre */}
          <TrayIcon
            label="Control Centre"
            active={trayPanel?.id === 'controlcenter'}
            onClick={e => openTray('controlcenter', e.currentTarget)}
          >
            <LayoutGrid size={12} strokeWidth={2} />
          </TrayIcon>

          {/* Clock — click for calendar */}
          <button
            className="min-w-[148px] text-right pr-2 pl-1 text-[13px] font-normal tabular-nums text-white/95 cursor-default rounded hover:bg-white/12 transition-colors duration-150 h-full"
            style={{ background: trayPanel?.id === 'clock' ? 'rgba(255,255,255,0.18)' : undefined }}
            onClick={e => openTray('clock', e.currentTarget)}
            suppressHydrationWarning
          >
            {time ?? ''}
          </button>
        </div>
      </header>

      {/* Menu bar dropdowns */}
      {portalReady && (
        <AnimatePresence>
          {menu && (
            <DropdownPortal
              key={menu.key}
              menuKey={menu.key}
              x={menu.x}
              y={menu.y}
              onClose={() => setMenu(null)}
            />
          )}
        </AnimatePresence>
      )}

      {/* Tray icon panels + Spotlight */}
      {portalReady && (
        <TrayPanels
          panel={trayPanel}
          spotlight={spotlight}
          onClose={() => { setTrayPanel(null); setSpotlight(false); }}
        />
      )}
    </>
  );
}
