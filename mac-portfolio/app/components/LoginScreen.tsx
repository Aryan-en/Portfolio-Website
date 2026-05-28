"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Wifi, BatteryMedium, ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface LoginScreenProps {
  onComplete: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Clock helpers
// ─────────────────────────────────────────────────────────────────────────────

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

interface ClockState {
  timeStr: string;  // "1:33"
  dateStr: string;  // "Thu 28 May"
}

function getClockState(): ClockState {
  const now   = new Date();
  const rawH  = now.getHours();
  const h     = rawH % 12 || 12;
  const min   = now.getMinutes().toString().padStart(2, '0');
  const day   = DAYS[now.getDay()];
  const d     = now.getDate();
  const month = MONTHS[now.getMonth()];
  return {
    timeStr: `${h}:${min}`,
    dateStr: `${day} ${d} ${month}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Background gradient — matched to the Goa beach aerial photo:
//   left  → teal/turquoise ocean
//   centre → warm golden sand + rocks
//   right  → dense green palm forest
// Visible only when public/login-bg.jpg is absent; the <img> tag overlays it.
// ─────────────────────────────────────────────────────────────────────────────

const BG_GRADIENT = [
  // Teal ocean — left half
  'radial-gradient(ellipse 55% 110% at -5% 45%,  #0B5C58 0%, #197A70 30%, #2A9A88 50%, transparent 70%)',
  // Ocean-to-sand transition strip
  'radial-gradient(ellipse 30% 100% at 28% 50%,  #1E8878 0%, transparent 55%)',
  // Warm sandy beach — centre
  'radial-gradient(ellipse 40% 90%  at 45% 40%,  #D4B264 0%, #C8A048 30%, transparent 65%)',
  // Sandy foreground with rock shadows
  'radial-gradient(ellipse 35% 60%  at 55% 75%,  #B89040 0%, transparent 55%)',
  // Green palm canopy — right two-thirds
  'radial-gradient(ellipse 60% 110% at 105% 55%, #2A7818 0%, #1C5810 40%, transparent 100%)',
  // Dense mid-right forest
  'radial-gradient(ellipse 40% 80%  at 78% 65%,  #356820 0%, transparent 55%)',
  // Base tone gradient left-to-right
  'linear-gradient(105deg, #0C5C5C 0%, #1A8878 12%, #C4A045 32%, #A89045 48%, #5A8025 62%, #286818 78%, #1A4C10 100%)',
].join(', ');

// ─────────────────────────────────────────────────────────────────────────────
// LoginScreen
// ─────────────────────────────────────────────────────────────────────────────

export function LoginScreen({ onComplete }: LoginScreenProps) {
  const [clock, setClock]       = useState<ClockState | null>(null);
  const [password, setPassword] = useState('');
  const [focused, setFocused]   = useState(false);
  const [bgFailed, setBgFailed] = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  // Ticking clock — starts null to avoid hydration mismatch
  useEffect(() => {
    setClock(getClockState());
    const id = setInterval(() => setClock(getClockState()), 1000);
    return () => clearInterval(id);
  }, []);

  const login = useCallback(() => onComplete(), [onComplete]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') login();
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <motion.div
      className="fixed inset-0 z-[9998] overflow-hidden select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(12px)' }}
      transition={{ duration: 0.55, ease: [0.32, 0, 0.67, 0] }}
      onClick={focusInput}
    >
      {/* ── Background ── */}
      {/*
        next/image tries public/login-bg.jpg first.
        If the file is missing → onError fires → bgFailed=true → gradient renders.
        To activate the real photo:
          1. Save the beach image from this conversation
          2. Name it  login-bg.jpg
          3. Drop it into  mac-portfolio/public/
      */}
      <div className="absolute inset-0">
        {!bgFailed ? (
          <Image
            src="/login-bg.jpg"
            alt=""
            fill
            priority
            unoptimized
            className="object-cover"
            onError={() => setBgFailed(true)}
          />
        ) : (
          <div className="absolute inset-0" style={{ background: BG_GRADIENT }} />
        )}
      </div>

      {/* Subtle top vignette so status icons stay legible over bright photos */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />

      {/* Subtle bottom vignette so login panel stays legible */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* ── Top-right: keyboard source · battery · wifi ── */}
      <div className="absolute top-3 right-4 flex items-center gap-2.5 text-white/90 text-[12px] font-medium">
        <span className="tracking-tight">ABC – India</span>
        <BatteryMedium size={16} strokeWidth={1.5} aria-label="Battery" />
        <Wifi           size={14} strokeWidth={1.75} aria-label="Wi-Fi"  />
      </div>

      {/* ── Clock: date + large time ── */}
      <div className="absolute top-[9%] w-full flex flex-col items-center pointer-events-none">
        {/* Date — "Thu 28 May" */}
        <p
          className="text-white/70 font-light tracking-wide mb-1"
          style={{ fontSize: 'clamp(15px, 1.5vw, 20px)' }}
          suppressHydrationWarning
        >
          {clock?.dateStr ?? ''}
        </p>

        {/*
          Time — macOS lock screen renders this in SF Display Thin at roughly
          10–12 vw.  "clamp" keeps it readable on all screen sizes.
          font-[100] = thin weight; tracking-tight tightens the letter spacing
          to match the macOS look.
        */}
        <p
          className="text-white/75 leading-none tabular-nums tracking-tight"
          style={{
            fontSize: 'clamp(80px, 13vw, 160px)',
            fontWeight: 100,
          }}
          suppressHydrationWarning
        >
          {clock?.timeStr ?? ''}
        </p>
      </div>

      {/* ── Login panel: avatar · password · hint ── */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">

        {/* Avatar circle */}
        <button
          onClick={login}
          aria-label="Log in as Aryan Singh"
          className="relative w-[68px] h-[68px] rounded-full overflow-hidden ring-[1.5px] ring-white/30 shadow-2xl shadow-black/40 transition-transform active:scale-95 cursor-default"
        >
          {/* Gradient fallback (shown when avatar.jpg is absent) */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-rose-200 to-pink-300 flex items-center justify-center">
            <span className="text-2xl font-semibold text-white/90 leading-none">A</span>
          </div>
          {/* User photo — place at public/avatar.jpg */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/avatar.jpg"
            alt="Aryan Singh"
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        </button>

        {/* Password input */}
        <div className="relative w-52" onClick={e => e.stopPropagation()}>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter Password"
            className={[
              'w-full h-[30px] rounded-full text-center text-[13px]',
              'text-white placeholder-white/55 caret-white',
              'outline-none transition-all duration-200',
              'backdrop-blur-sm',
              focused
                ? 'bg-white/15 border border-white/35 shadow-lg shadow-black/20'
                : 'bg-white/10 border border-white/20',
            ].join(' ')}
            // Nudge cursor to left of centre to make room for the arrow button
            style={{ paddingLeft: '16px', paddingRight: password.length ? '28px' : '16px' }}
          />

          {/* Submit arrow — appears once the user starts typing */}
          <AnimatePresence>
            {password.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                onClick={login}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                aria-label="Submit password"
              >
                <ArrowRight size={13} strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Touch ID hint */}
        <button
          onClick={login}
          className="text-white text-[13px] font-semibold tracking-wide hover:text-white/75 transition-colors cursor-default"
        >
          Touch ID or Enter Password
        </button>
      </div>
    </motion.div>
  );
}
