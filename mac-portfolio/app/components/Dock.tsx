"use client";

import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import { useOsStore } from '@/src/store/useOsStore';
import {
  LeetCodeIcon,
  GitHubIcon,
  LinkedInIcon,
  InstagramIcon,
  FinderImageIcon,
  SafariImageIcon,
  TerminalImageIcon,
  TrashDockIcon,
  AppStoreIcon,
  LaunchpadIcon,
  MailDockIcon,
  SettingsDockIcon,
  PreviewDockIcon,
  NotesDockIcon,
} from './DockIcons';

// ─────────────────────────────────────────────────────────────────────────────
// Physics constants
// ─────────────────────────────────────────────────────────────────────────────

const BASE       = 54;   // resting icon size (px)
const MAX        = 118;  // peak size — noticeably more dramatic magnification
const MAG_RADIUS = 160;  // wider bell-curve so nearby icons also rise

// Shelf height stays locked to BASE regardless of how large icons get.
const SHELF_H = BASE + 8 + 3 + 4 + 7; // 76 px

// Smooth spring: more mass + lower stiffness = fluid physical motion.
// Damping just above critical → clean settle, no oscillation.
const SPRING = { mass: 0.18, stiffness: 140, damping: 12 } as const;

// ─────────────────────────────────────────────────────────────────────────────
// App registry
// ─────────────────────────────────────────────────────────────────────────────

interface DockApp {
  id: string;
  title: string;
  Icon: React.ElementType;
  bg: string;
}

const SOCIAL_APPS: DockApp[] = [
  { id: 'leetcode',  title: 'LeetCode',  Icon: LeetCodeIcon,  bg: '#1A1A1A' },
  { id: 'github',    title: 'GitHub',    Icon: GitHubIcon,    bg: '#24292E' },
  { id: 'linkedin',  title: 'LinkedIn',  Icon: LinkedInIcon,  bg: '#0A66C2' },
  {
    id: 'instagram', title: 'Instagram', Icon: InstagramIcon,
    bg: 'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
  },
];

const SYSTEM_APPS: DockApp[] = [
  { id: 'finder',    title: 'Finder',    Icon: FinderImageIcon,   bg: 'linear-gradient(145deg,#1A7EF4,#0B62E4)' },
  { id: 'launchpad', title: 'Launchpad', Icon: LaunchpadIcon,     bg: 'linear-gradient(145deg,#E8E8EC,#C8C8CE)' },
  { id: 'appstore',  title: 'App Store', Icon: AppStoreIcon,      bg: 'linear-gradient(145deg,#1C90FF,#0B70D8)' },
  { id: 'safari',    title: 'Safari',    Icon: SafariImageIcon,   bg: 'linear-gradient(145deg,#3478F6,#1254D4)' },
  { id: 'mail',      title: 'Mail',      Icon: MailDockIcon,      bg: 'linear-gradient(145deg,#1E8EF5,#0A5FCC)' },
  { id: 'notes',     title: 'Notes',     Icon: NotesDockIcon,     bg: 'linear-gradient(145deg,#FFD426,#FFB800)' },
  { id: 'preview',   title: 'Preview',   Icon: PreviewDockIcon,   bg: 'linear-gradient(145deg,#4B8EC8,#1A5EA8)' },
  { id: 'settings',  title: 'Settings',  Icon: SettingsDockIcon,  bg: 'linear-gradient(145deg,#8E8E93,#5A5A5E)' },
  { id: 'terminal',  title: 'Terminal',  Icon: TerminalImageIcon, bg: 'linear-gradient(145deg,#1C1C1E,#000)' },
];

const TRASH_APP: DockApp = {
  id: 'trash', title: 'Trash', Icon: TrashDockIcon,
  bg: 'linear-gradient(145deg,#C4C4C6,#8E8E93)',
};

// ─────────────────────────────────────────────────────────────────────────────
// DockIcon
// ─────────────────────────────────────────────────────────────────────────────

interface DockIconProps {
  app: DockApp;
  mouseX: MotionValue<number>;
}

function DockIcon({ app, mouseX }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const openApp     = useOsStore((s) => s.openApp);
  const minimizeApp = useOsStore((s) => s.minimizeApp);
  const win         = useOsStore((s) => s.windows.find((w) => w.id === app.id));

  // Signed px distance: cursor X minus this icon's horizontal centre.
  // Runs inside the Framer Motion scheduler — no React re-renders on move.
  const distance = useTransform(mouseX, (x: number) => {
    const el = ref.current;
    if (!el) return MAG_RADIUS + 1;
    const { left, width } = el.getBoundingClientRect();
    return x - (left + width / 2);
  });

  // Symmetric bell curve: MAX at centre, BASE at ±MAG_RADIUS.
  const sizeTarget = useTransform(
    distance,
    [-MAG_RADIUS, 0, MAG_RADIUS],
    [BASE, MAX, BASE],
  );

  // Physical spring gives the icon momentum — fluid, smooth motion.
  const size = useSpring(sizeTarget, SPRING);

  const handleClick = () => {
    if (win && !win.isMinimized) minimizeApp(app.id);
    else openApp(app.id, app.title);
  };

  return (
    // `relative` anchors the absolutely-positioned label.
    // `overflow: visible` lets the spring-driven button grow above SHELF_H.
    // `items-end` on the parent row keeps the wrapper bottom pinned to the shelf.
    <div
      className="relative flex flex-col items-center gap-[3px]"
      style={{ overflow: 'visible' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── App-name label ─────────────────────────────────────────────────
          Absolute so it never shifts flex layout.
          `bottom: calc(100% + 10px)` tracks the wrapper's auto height, which
          follows the spring-animated icon — label rises with the icon.  ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="label"
            initial={{ opacity: 0, y: 6,  scale: 0.88 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 6,  scale: 0.88 }}
            transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-1/2 -translate-x-1/2 z-[60] pointer-events-none select-none"
            style={{ bottom: 'calc(100% + 10px)' }}
          >
            <span className="block px-[10px] py-[5px] rounded-[8px] text-[11px] font-medium leading-none whitespace-nowrap text-white/90 bg-[rgba(20,20,20,0.82)] backdrop-blur-md border border-white/[0.10] shadow-xl shadow-black/40">
              {app.title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Icon button ──────────────────────────────────────────────────── */}
      <motion.button
        ref={ref}
        onClick={handleClick}
        style={{
          width: size,
          height: size,
          boxShadow: '0 6px 24px rgba(0,0,0,0.50), 0 1px 4px rgba(0,0,0,0.28)',
        }}
        whileTap={{ scale: 0.87 }}
        className="relative flex items-center justify-center rounded-[22%] overflow-hidden cursor-default flex-shrink-0"
        aria-label={app.title}
      >
        <span aria-hidden className="absolute inset-0" style={{ background: app.bg }} />
        <div className="relative z-10 flex items-center justify-center w-[62%] h-[62%]">
          <app.Icon className="w-full h-full" />
        </div>
      </motion.button>

      {/* ── Open-indicator dot ───────────────────────────────────────────── */}
      <div
        aria-hidden
        className={[
          'h-1 w-1 rounded-full bg-white/80 flex-shrink-0 transition-opacity duration-300',
          win?.isOpen ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Separator
// ─────────────────────────────────────────────────────────────────────────────

function Separator() {
  return (
    <div
      aria-hidden
      className="self-stretch w-px mx-1.5 my-2 rounded-full bg-white/20 flex-shrink-0"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dock
// ─────────────────────────────────────────────────────────────────────────────

export function Dock() {
  const mouseX = useMotionValue(Infinity);

  return (
    // Outer wrapper: no height set — derived from the icon row (SHELF_H).
    // overflow-visible (browser default) lets icons float above the glass pill.
    <div
      role="toolbar"
      aria-label="Dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50"
    >
      {/* ── Glass pill ──────────────────────────────────────────────────────
          Absolutely positioned so it never participates in layout sizing.
          Its width tracks the outer wrapper (which tracks the icon row width),
          but its height is fixed: `inset-0` matches the outer wrapper whose
          height equals SHELF_H from the in-flow icon row below.         ── */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl backdrop-blur-2xl bg-white/[0.12] border border-white/20 shadow-2xl shadow-black/50 pointer-events-none"
      />

      {/* ── Icon row ────────────────────────────────────────────────────────
          Fixed height = SHELF_H.  overflow:visible lets magnified icons
          protrude above the shelf.  items-end pins every icon's bottom edge
          to the shelf bottom so magnification always grows upward.       ── */}
      <div
        className="relative flex items-end gap-[9px] px-3"
        style={{ height: SHELF_H, overflow: 'visible', paddingBottom: 8 }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {SOCIAL_APPS.map((app) => (
          <DockIcon key={app.id} app={app} mouseX={mouseX} />
        ))}

        <Separator />

        {SYSTEM_APPS.map((app) => (
          <DockIcon key={app.id} app={app} mouseX={mouseX} />
        ))}

        <Separator />

        <DockIcon app={TRASH_APP} mouseX={mouseX} />
      </div>
    </div>
  );
}
