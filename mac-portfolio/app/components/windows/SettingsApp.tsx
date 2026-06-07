"use client";

import { useState } from 'react';
import {
  Wifi, Bluetooth, Globe, Battery, Settings, Accessibility, Sun,
  Monitor, Bell, Volume2, Moon, Clock, Shield, Search, ChevronRight,
  Lock, Fingerprint, HardDrive, Key, Calendar, Share2, Download,
  User, Laptop, Timer, AlignJustify, Eye,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarItem {
  id: string;
  label: string;
  iconBg: string;
  icon: React.ReactNode;
}

type RowKind = 'nav' | 'toggle' | 'info' | 'value';

interface PanelRow {
  id: string;
  label: string;
  kind?: RowKind;
  iconBg?: string;
  icon?: React.ReactNode;
  value?: string;
  defaultToggle?: boolean;
}

interface PanelSection {
  rows: PanelRow[];
}

interface PanelDef {
  title: string;
  subtitle?: string;
  headerIcon: React.ReactNode;
  headerIconBg: string;
  sections: PanelSection[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared icon wrapper
// ─────────────────────────────────────────────────────────────────────────────

function SIcon({ bg, size = 16, children }: { bg: string; size?: number; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[7px] flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{ width: size + 14, height: size + 14, background: bg }}
    >
      {children}
    </div>
  );
}

function RIcon({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div
      className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center flex-shrink-0"
      style={{ background: bg }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle switch
// ─────────────────────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      className="relative flex-shrink-0 rounded-full transition-colors duration-200 cursor-default"
      style={{ width: 38, height: 22, background: on ? '#34C759' : 'rgba(120,120,128,0.30)' }}
    >
      <span
        className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-md transition-transform duration-200"
        style={{ transform: on ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar config
// ─────────────────────────────────────────────────────────────────────────────

const W = 16; // icon width
const wh = { size: W, strokeWidth: 2, color: 'white' };

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'wifi',         label: 'Wi-Fi',                    iconBg: '#3A7BF0', icon: <Wifi           {...wh} /> },
  { id: 'bluetooth',    label: 'Bluetooth',                iconBg: '#3A7BF0', icon: <Bluetooth       {...wh} /> },
  { id: 'network',      label: 'Network',                  iconBg: '#3A7BF0', icon: <Globe           {...wh} /> },
  { id: 'battery',      label: 'Battery',                  iconBg: '#34C759', icon: <Battery         {...wh} /> },
  { id: 'general',      label: 'General',                  iconBg: '#8E8E93', icon: <Settings        {...wh} /> },
  { id: 'accessibility',label: 'Accessibility',            iconBg: '#3A7BF0', icon: <Accessibility   {...wh} /> },
  { id: 'appearance',   label: 'Appearance',               iconBg: '#1C1C1E', icon: <Eye             {...wh} /> },
  { id: 'siri',         label: 'Apple Intelligence & Siri',iconBg: 'linear-gradient(135deg,#FF6B35,#A855F7)', icon: <Sun {...wh} /> },
  { id: 'desktop',      label: 'Desktop & Dock',           iconBg: '#636366', icon: <Monitor         {...wh} /> },
  { id: 'displays',     label: 'Displays',                 iconBg: '#3A7BF0', icon: <Monitor         {...wh} /> },
  { id: 'menubar',      label: 'Menu Bar',                 iconBg: '#636366', icon: <AlignJustify    {...wh} /> },
  { id: 'spotlight',    label: 'Spotlight',                iconBg: '#3A7BF0', icon: <Search          {...wh} /> },
  { id: 'wallpaper',    label: 'Wallpaper',                iconBg: '#5E5CE6', icon: <Sun             {...wh} /> },
  { id: 'notifications',label: 'Notifications',            iconBg: '#FF3B30', icon: <Bell            {...wh} /> },
  { id: 'sound',        label: 'Sound',                    iconBg: '#FF6B35', icon: <Volume2         {...wh} /> },
  { id: 'focus',        label: 'Focus',                    iconBg: '#5E5CE6', icon: <Moon            {...wh} /> },
  { id: 'screentime',   label: 'Screen Time',              iconBg: '#5E5CE6', icon: <Timer           {...wh} /> },
  { id: 'lockscreen',   label: 'Lock Screen',              iconBg: '#1C1C1E', icon: <Lock            {...wh} /> },
  { id: 'privacy',      label: 'Privacy & Security',       iconBg: '#636366', icon: <Shield          {...wh} /> },
  { id: 'touchid',      label: 'Touch ID & Password',      iconBg: '#2C2C2E', icon: <Fingerprint     {...wh} /> },
];

// ─────────────────────────────────────────────────────────────────────────────
// Panel definitions
// ─────────────────────────────────────────────────────────────────────────────

const PANELS: Record<string, PanelDef> = {
  general: {
    title: 'General',
    subtitle: 'Manage your overall setup and preferences for Mac, such as software updates, device language, AirDrop and more.',
    headerIcon: <Settings size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#8E8E93',
    sections: [
      {
        rows: [
          { id: 'about',    label: 'About',             kind: 'nav', iconBg: '#636366', icon: <Laptop       size={13} color="white" strokeWidth={2} /> },
          { id: 'update',   label: 'Software Update',   kind: 'nav', iconBg: '#636366', icon: <Download     size={13} color="white" strokeWidth={2} /> },
          { id: 'storage',  label: 'Storage',           kind: 'nav', iconBg: '#636366', icon: <HardDrive    size={13} color="white" strokeWidth={2} /> },
          { id: 'applecare',label: 'AppleCare & Warranty', kind: 'nav', iconBg: '#FF3B30', icon: <div className="w-3 h-3 rounded-[2px] flex items-center justify-center bg-white/20"><span style={{fontSize:8, color:'white', fontWeight:800}}>🍎</span></div> },
          { id: 'airdrop',  label: 'AirDrop & Continuity', kind: 'nav', iconBg: '#34B5E5', icon: <Wifi      size={13} color="white" strokeWidth={2} /> },
          { id: 'autofill', label: 'AutoFill & Passwords', kind: 'nav', iconBg: '#636366', icon: <Key       size={13} color="white" strokeWidth={2} /> },
          { id: 'datetime', label: 'Date & Time',       kind: 'nav', iconBg: '#3A7BF0', icon: <Calendar     size={13} color="white" strokeWidth={2} /> },
          { id: 'language', label: 'Language & Region', kind: 'nav', iconBg: '#3A7BF0', icon: <Globe        size={13} color="white" strokeWidth={2} /> },
          { id: 'login',    label: 'Login Items & Extensions', kind: 'nav', iconBg: '#636366', icon: <AlignJustify size={13} color="white" strokeWidth={2} /> },
          { id: 'sharing',  label: 'Sharing',           kind: 'nav', iconBg: '#34C759', icon: <Share2       size={13} color="white" strokeWidth={2} /> },
          { id: 'startup',  label: 'Startup Disk',      kind: 'nav', iconBg: '#636366', icon: <HardDrive    size={13} color="white" strokeWidth={2} /> },
          { id: 'timem',    label: 'Time Machine',      kind: 'nav', iconBg: '#34C759', icon: <Clock        size={13} color="white" strokeWidth={2} /> },
          { id: 'devmgmt',  label: 'Device Management', kind: 'nav', iconBg: '#636366', icon: <Shield       size={13} color="white" strokeWidth={2} /> },
        ],
      },
    ],
  },

  wifi: {
    title: 'Wi-Fi',
    subtitle: 'Control Wi-Fi connectivity and manage known networks.',
    headerIcon: <Wifi size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#3A7BF0',
    sections: [
      {
        rows: [
          { id: 'wifi-on',    label: 'Wi-Fi',            kind: 'toggle', defaultToggle: true },
          { id: 'wifi-net',   label: 'Portfolio Network', kind: 'value',  value: 'Connected ✓' },
        ],
      },
      {
        rows: [
          { id: 'ask',        label: 'Ask to join networks',    kind: 'toggle', defaultToggle: true  },
          { id: 'ask-h',      label: 'Ask to join hotspots',    kind: 'toggle', defaultToggle: false },
        ],
      },
      {
        rows: [
          { id: 'known',      label: 'Known Networks',          kind: 'nav' },
        ],
      },
    ],
  },

  bluetooth: {
    title: 'Bluetooth',
    subtitle: 'Allow Bluetooth devices to connect to your Mac.',
    headerIcon: <Bluetooth size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#3A7BF0',
    sections: [
      {
        rows: [
          { id: 'bt-on',  label: 'Bluetooth', kind: 'toggle', defaultToggle: true },
        ],
      },
      {
        rows: [
          { id: 'bt-kboard', label: 'Magic Keyboard',  kind: 'value', value: 'Connected' },
          { id: 'bt-mouse',  label: 'Magic Mouse',     kind: 'value', value: 'Connected' },
          { id: 'bt-pods',   label: 'AirPods Pro',     kind: 'value', value: 'Not Connected' },
        ],
      },
    ],
  },

  battery: {
    title: 'Battery',
    subtitle: 'Monitor battery health and configure power settings.',
    headerIcon: <Battery size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#34C759',
    sections: [
      {
        rows: [
          { id: 'batt-pct',    label: 'Battery',             kind: 'value', value: '87%' },
          { id: 'batt-health', label: 'Battery Health',      kind: 'value', value: 'Normal' },
          { id: 'batt-cycles', label: 'Cycle Count',         kind: 'value', value: '142' },
        ],
      },
      {
        rows: [
          { id: 'low-power',   label: 'Low Power Mode',      kind: 'toggle', defaultToggle: false },
          { id: 'opt-charge',  label: 'Optimized Charging',  kind: 'toggle', defaultToggle: true  },
        ],
      },
      {
        rows: [
          { id: 'batt-hist',   label: 'Battery History',     kind: 'nav' },
        ],
      },
    ],
  },

  appearance: {
    title: 'Appearance',
    subtitle: 'Customise the look and feel of your Mac interface.',
    headerIcon: <Eye size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#1C1C1E',
    sections: [
      {
        rows: [
          { id: 'app-mode', label: 'Appearance', kind: 'value', value: 'Dark' },
          { id: 'app-acc',  label: 'Accent Color', kind: 'value', value: 'Blue' },
          { id: 'app-high', label: 'Highlight Color', kind: 'value', value: 'Blue' },
        ],
      },
      {
        rows: [
          { id: 'sidebar-size', label: 'Sidebar Icon Size', kind: 'value', value: 'Medium' },
          { id: 'show-scroll',  label: 'Show Scroll Bars',  kind: 'value', value: 'Automatically' },
        ],
      },
    ],
  },

  notifications: {
    title: 'Notifications',
    subtitle: 'Control how and when apps are allowed to send you notifications.',
    headerIcon: <Bell size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#FF3B30',
    sections: [
      {
        rows: [
          { id: 'notif-dnd', label: 'Allow Notifications',  kind: 'toggle', defaultToggle: true  },
          { id: 'notif-lock',label: 'Show on Lock Screen',  kind: 'toggle', defaultToggle: true  },
          { id: 'notif-siri',label: 'Siri Suggestions',     kind: 'toggle', defaultToggle: false },
        ],
      },
      {
        rows: [
          { id: 'notif-safari', label: 'Safari',    kind: 'nav', iconBg: '#3A7BF0', icon: <Globe size={13} color="white" strokeWidth={2} /> },
          { id: 'notif-mail',   label: 'Mail',      kind: 'nav', iconBg: '#3A7BF0', icon: <Share2 size={13} color="white" strokeWidth={2} /> },
          { id: 'notif-notes',  label: 'Notes',     kind: 'nav', iconBg: '#FFCC00', icon: <AlignJustify size={13} color="white" strokeWidth={2} /> },
        ],
      },
    ],
  },

  sound: {
    title: 'Sound',
    subtitle: 'Manage audio output, input devices, and sound effects.',
    headerIcon: <Volume2 size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#FF6B35',
    sections: [
      {
        rows: [
          { id: 'output-vol',  label: 'Output Volume',   kind: 'value', value: '75%' },
          { id: 'output-dev',  label: 'Output Device',   kind: 'value', value: 'MacBook Pro Speakers' },
          { id: 'input-dev',   label: 'Input Device',    kind: 'value', value: 'MacBook Pro Microphone' },
        ],
      },
      {
        rows: [
          { id: 'startup-snd', label: 'Play sound on startup',   kind: 'toggle', defaultToggle: false },
          { id: 'ui-snd',      label: 'Play user interface sounds', kind: 'toggle', defaultToggle: true  },
        ],
      },
    ],
  },

  privacy: {
    title: 'Privacy & Security',
    subtitle: 'Control what data apps can access and manage your security settings.',
    headerIcon: <Shield size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#636366',
    sections: [
      {
        rows: [
          { id: 'loc',      label: 'Location Services',  kind: 'nav', iconBg: '#3A7BF0', icon: <Globe     size={13} color="white" strokeWidth={2} /> },
          { id: 'contacts', label: 'Contacts',           kind: 'nav', iconBg: '#FF6B35', icon: <User      size={13} color="white" strokeWidth={2} /> },
          { id: 'camera',   label: 'Camera',             kind: 'nav', iconBg: '#1C1C1E', icon: <Eye       size={13} color="white" strokeWidth={2} /> },
          { id: 'micro',    label: 'Microphone',         kind: 'nav', iconBg: '#FF3B30', icon: <Volume2   size={13} color="white" strokeWidth={2} /> },
        ],
      },
      {
        rows: [
          { id: 'filewall',   label: 'Firewall',          kind: 'value',  value: 'On' },
          { id: 'filevault',  label: 'FileVault',         kind: 'value',  value: 'On' },
          { id: 'lockafter',  label: 'Lock After Screen Saver', kind: 'toggle', defaultToggle: true },
        ],
      },
    ],
  },

  focus: {
    title: 'Focus',
    subtitle: 'Use Focus to automatically filter notifications based on what you\'re doing.',
    headerIcon: <Moon size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#5E5CE6',
    sections: [
      {
        rows: [
          { id: 'dnd',      label: 'Do Not Disturb',   kind: 'nav', iconBg: '#636366', icon: <Moon   size={13} color="white" strokeWidth={2} /> },
          { id: 'work',     label: 'Work',             kind: 'nav', iconBg: '#FF6B35', icon: <Laptop size={13} color="white" strokeWidth={2} /> },
          { id: 'personal', label: 'Personal',         kind: 'nav', iconBg: '#5E5CE6', icon: <User   size={13} color="white" strokeWidth={2} /> },
          { id: 'sleep',    label: 'Sleep',            kind: 'nav', iconBg: '#1C1C1E', icon: <Moon   size={13} color="white" strokeWidth={2} /> },
        ],
      },
      {
        rows: [
          { id: 'share-focus', label: 'Share across devices', kind: 'toggle', defaultToggle: true },
        ],
      },
    ],
  },

  lockscreen: {
    title: 'Lock Screen',
    subtitle: 'Configure how your Mac locks and what\'s visible on the lock screen.',
    headerIcon: <Lock size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#2C2C2E',
    sections: [
      {
        rows: [
          { id: 'screensaver',   label: 'Start Screen Saver when inactive',  kind: 'value',  value: 'For 5 minutes' },
          { id: 'display-sleep', label: 'Turn display off when inactive',     kind: 'value',  value: 'For 10 minutes' },
          { id: 'lock-sleep',    label: 'Require password after sleep',       kind: 'value',  value: 'Immediately' },
        ],
      },
      {
        rows: [
          { id: 'showmsg',   label: 'Show message when locked', kind: 'toggle', defaultToggle: false },
          { id: 'showtime',  label: 'Show time on lock screen', kind: 'toggle', defaultToggle: true  },
        ],
      },
    ],
  },

  // fallback for others
  accessibility: {
    title: 'Accessibility',
    subtitle: 'Adjust display, interaction, and audio settings for greater accessibility.',
    headerIcon: <Accessibility size={28} color="white" strokeWidth={1.8} />,
    headerIconBg: '#3A7BF0',
    sections: [
      { rows: [
        { id: 'voiceover', label: 'VoiceOver',       kind: 'toggle', defaultToggle: false },
        { id: 'zoom',      label: 'Zoom',            kind: 'nav'    },
        { id: 'display',   label: 'Display',         kind: 'nav'    },
        { id: 'caption',   label: 'Captions',        kind: 'nav'    },
        { id: 'siri-a',    label: 'Siri',            kind: 'nav'    },
      ]},
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Panel renderer
// ─────────────────────────────────────────────────────────────────────────────

function PanelContent({ panelId }: { panelId: string }) {
  const panel = PANELS[panelId];
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (panel) {
      panel.sections.forEach(s =>
        s.rows.forEach(r => {
          if (r.kind === 'toggle') initial[r.id] = r.defaultToggle ?? false;
        }),
      );
    }
    return initial;
  });

  if (!panel) {
    // Fallback for panels without definitions
    const item = SIDEBAR_ITEMS.find(i => i.id === panelId);
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        {item && (
          <div className="w-[64px] h-[64px] rounded-[16px] flex items-center justify-center shadow-lg" style={{ background: item.iconBg }}>
            <div style={{ transform: 'scale(2.5)', transformOrigin: 'center' }}>{item.icon}</div>
          </div>
        )}
        <h2 className="text-[20px] font-bold" style={{ color: 'rgba(255,255,255,0.88)' }}>{item?.label}</h2>
        <p className="text-[13px] text-center max-w-[320px]" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Settings for this section are managed through your macOS system.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Panel header */}
      <div className="flex flex-col items-center pt-8 pb-6 px-8 flex-shrink-0">
        <div
          className="w-[64px] h-[64px] rounded-[16px] flex items-center justify-center shadow-lg mb-3"
          style={{ background: panel.headerIconBg }}
        >
          {panel.headerIcon}
        </div>
        <h2 className="text-[20px] font-bold" style={{ color: 'rgba(255,255,255,0.90)' }}>{panel.title}</h2>
        {panel.subtitle && (
          <p className="text-[12px] text-center mt-1.5 leading-relaxed max-w-[420px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {panel.subtitle}
          </p>
        )}
      </div>

      {/* Settings sections */}
      <div className="px-6 pb-8 flex flex-col gap-3">
        {panel.sections.map((section, si) => (
          <div
            key={si}
            className="rounded-[12px] overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {section.rows.map((row, ri) => (
              <div key={row.id}>
                {/* Divider */}
                {ri > 0 && (
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginLeft: row.icon ? 52 : 16 }} />
                )}

                <div
                  className="flex items-center gap-3 px-4 py-[11px] cursor-default transition-colors duration-100"
                  style={{ minHeight: 44 }}
                  onMouseEnter={e => {
                    if (row.kind === 'nav')
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {/* Row icon */}
                  {row.icon && row.iconBg && (
                    <RIcon bg={row.iconBg}>{row.icon}</RIcon>
                  )}

                  {/* Label */}
                  <span
                    className="flex-1 text-[13.5px]"
                    style={{ color: 'rgba(255,255,255,0.85)' }}
                  >
                    {row.label}
                  </span>

                  {/* Right content */}
                  {row.kind === 'toggle' ? (
                    <Toggle
                      on={toggles[row.id] ?? false}
                      onToggle={() => setToggles(t => ({ ...t, [row.id]: !t[row.id] }))}
                    />
                  ) : row.kind === 'value' ? (
                    <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {row.value}
                    </span>
                  ) : row.kind === 'info' ? (
                    <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {row.value}
                    </span>
                  ) : (
                    /* nav */
                    <ChevronRight size={14} color="rgba(255,255,255,0.28)" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function SettingsApp() {
  const [selected, setSelected] = useState('general');
  const [search, setSearch]     = useState('');

  const filtered = SIDEBAR_ITEMS.filter(
    i => !search || i.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="flex w-full h-full overflow-hidden select-none"
      style={{ background: '#1C1C1E', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <div
        className="flex flex-col flex-shrink-0 overflow-hidden"
        style={{ width: 252, background: '#252527', borderRight: '1px solid rgba(0,0,0,0.45)' }}
      >
        {/* Search */}
        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <div
            className="flex items-center gap-2 h-[28px] px-3 rounded-[7px]"
            style={{ background: 'rgba(255,255,255,0.09)' }}
          >
            <Search size={12} color="rgba(255,255,255,0.40)" strokeWidth={2.5} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-[12.5px] placeholder:text-white/35"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            />
          </div>
        </div>

        {/* User profile */}
        <div
          className="flex items-center gap-3 mx-2 mb-2 px-2 py-2 rounded-[8px] cursor-default transition-colors duration-100"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          {/* Avatar */}
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[18px] font-black text-white flex-shrink-0 shadow-md"
            style={{ background: 'linear-gradient(135deg, #FF9500, #FF6B35)' }}
          >
            A
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>Aryan Singh</p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>Apple Account</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 10px 4px' }} />

        {/* Settings items */}
        <div className="flex-1 overflow-y-auto px-1.5 pb-2">
          {filtered.map(item => {
            const isActive = selected === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className="w-full flex items-center gap-2.5 px-2 py-[5px] rounded-[7px] cursor-default transition-colors duration-100 text-left mb-0.5"
                style={{
                  background: isActive ? '#3577DB' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {/* Icon badge */}
                <div
                  className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ background: item.iconBg }}
                >
                  {item.icon}
                </div>

                <span
                  className="text-[12.5px] font-[400] truncate"
                  style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.82)' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right panel ──────────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-hidden"
        style={{ background: '#1C1C1E' }}
      >
        <PanelContent key={selected} panelId={selected} />
      </div>
    </div>
  );
}
