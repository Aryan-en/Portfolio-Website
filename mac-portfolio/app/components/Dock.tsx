"use client";

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import { LayoutGrid, Globe, Terminal, User, Code2, Trophy, Mail } from 'lucide-react';
import { useOsStore } from '@/src/store/useOsStore';

// ─────────────────────────────────────────────────────────────────────────────
// Physics constants
// ─────────────────────────────────────────────────────────────────────────────

/** Resting icon edge-length in px. */
const BASE = 56;

/** Peak edge-length in px when cursor is exactly centred on an icon. */
const MAX = 96;

/**
 * Half-width of the magnification zone (px).
 * Icons outside this radius from the cursor render at BASE size.
 */
const MAG_RADIUS = 140;

/**
 * Spring configuration.  Low mass + moderate stiffness creates the quick,
 * slightly springy rebound that characterises the macOS dock feel.
 */
const SPRING = { mass: 0.1, stiffness: 160, damping: 13 } as const;

// ─────────────────────────────────────────────────────────────────────────────
// App registry
// ─────────────────────────────────────────────────────────────────────────────

interface DockApp {
  id: string;
  title: string;
  Icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
}

const SYSTEM_APPS: DockApp[] = [
  {
    id: 'finder',
    title: 'Finder',
    Icon: LayoutGrid,
    gradientFrom: '#2563eb',
    gradientTo: '#1d4ed8',
  },
  {
    id: 'safari',
    title: 'Safari',
    Icon: Globe,
    gradientFrom: '#0ea5e9',
    gradientTo: '#0369a1',
  },
];

const USER_APPS: DockApp[] = [
  {
    id: 'about',
    title: 'About Me',
    Icon: User,
    gradientFrom: '#10b981',
    gradientTo: '#059669',
  },
  {
    id: 'projects',
    title: 'Projects',
    Icon: Code2,
    gradientFrom: '#8b5cf6',
    gradientTo: '#6d28d9',
  },
  {
    id: 'achievements',
    title: 'Achievements',
    Icon: Trophy,
    gradientFrom: '#f59e0b',
    gradientTo: '#d97706',
  },
  {
    id: 'contact',
    title: 'Contact',
    Icon: Mail,
    gradientFrom: '#06b6d4',
    gradientTo: '#0891b2',
  },
  {
    id: 'terminal',
    title: 'Terminal',
    Icon: Terminal,
    gradientFrom: '#374151',
    gradientTo: '#111827',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DockIcon
// ─────────────────────────────────────────────────────────────────────────────

interface DockIconProps {
  app: DockApp;
  /** Shared MotionValue tracking the cursor's viewport-X position. */
  mouseX: MotionValue<number>;
}

function DockIcon({ app, mouseX }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const openApp = useOsStore((s) => s.openApp);
  const minimizeApp = useOsStore((s) => s.minimizeApp);
  const win = useOsStore((s) => s.windows.find((w) => w.id === app.id));

  /**
   * distance: signed px offset between the cursor and this icon's horizontal
   * centre.  Computed inside the Framer Motion scheduler, never touching
   * React state — so no component re-renders on mouse move.
   */
  const distance = useTransform(mouseX, (cursorX: number) => {
    const el = ref.current;
    if (!el) return MAG_RADIUS;
    const { left, width } = el.getBoundingClientRect();
    return cursorX - (left + width / 2);
  });

  /**
   * sizeSync: maps distance to a target size using a symmetric bell curve.
   *   distance = 0       → MAX  (cursor exactly centred)
   *   distance = ±MAG_RADIUS → BASE (cursor at edge of zone)
   *   distance > MAG_RADIUS  → BASE (clamped by useTransform)
   */
  const sizeSync = useTransform(
    distance,
    [-MAG_RADIUS, 0, MAG_RADIUS],
    [BASE, MAX, BASE],
  );

  /**
   * size: adds physical spring inertia so the icon "catches up" to the target
   * size with a slight delay, matching macOS magnification physics.
   */
  const size = useSpring(sizeSync, SPRING);

  const handleClick = () => {
    if (win && !win.isMinimized) {
      // Visible window: collapse to dock (standard macOS behaviour on re-click)
      minimizeApp(app.id);
    } else {
      // Either not open or minimised: open / restore via the store
      openApp(app.id, app.title);
    }
  };

  const isOpen = !!win?.isOpen;

  return (
    <div className="flex flex-col items-center justify-end gap-[3px]">
      <motion.button
        ref={ref}
        onClick={handleClick}
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.86 }}
        className="relative flex items-center justify-center rounded-[22%] shadow-lg shadow-black/40 overflow-hidden cursor-default"
        title={app.title}
        aria-label={app.title}
      >
        {/* Coloured icon background */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(145deg, ${app.gradientFrom}, ${app.gradientTo})`,
          }}
        />

        {/* Icon — sized relative to the spring-driven button so it scales too */}
        <app.Icon
          aria-hidden
          className="relative z-10 text-white"
          style={{ width: '52%', height: '52%' }}
          strokeWidth={1.75}
        />
      </motion.button>

      {/* Open indicator dot — visible when the app has an active window */}
      <div
        aria-hidden
        className={[
          'h-1 w-1 rounded-full bg-white transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0',
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
      className="self-stretch w-px mx-1 my-2 rounded-full bg-white/20 flex-shrink-0"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dock
// ─────────────────────────────────────────────────────────────────────────────

export function Dock() {
  /**
   * mouseX is set to Infinity when the cursor leaves the dock, which pushes
   * every icon's distance well beyond MAG_RADIUS — all icons spring back to
   * BASE size.  No React state involved, so the Dock component itself never
   * re-renders on mouse move.
   */
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      role="toolbar"
      aria-label="Dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        className="flex items-end gap-2 px-3 pt-2 pb-1 rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl shadow-black/50"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {SYSTEM_APPS.map((app) => (
          <DockIcon key={app.id} app={app} mouseX={mouseX} />
        ))}

        <Separator />

        {USER_APPS.map((app) => (
          <DockIcon key={app.id} app={app} mouseX={mouseX} />
        ))}
      </motion.div>
    </div>
  );
}
