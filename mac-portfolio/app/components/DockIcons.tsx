/**
 * Accurate SVG icon components for Dock apps.
 * Each renders within a square viewBox and is designed to sit inside
 * the coloured gradient tile that DockIcon provides.
 */

import Image from 'next/image';

interface IconProps {
  size?: number;
  className?: string;
}

// ─── Social / Dev ─────────────────────────────────────────────────────────────

export function LeetCodeIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path
        fill="#FFA116"
        d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z"
      />
      <path
        fill="#B3B3B3"
        d="M10.617 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382h10.174a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"
      />
    </svg>
  );
}

export function GitHubIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden fill="white">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function LinkedInIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden fill="white">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function InstagramIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden fill="white">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

// ─── macOS System ─────────────────────────────────────────────────────────────

export function FinderIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      {/* Split background — rendered by the parent tile, icon is pure shape */}
      {/* Left face half (darker) */}
      <path d="M50 8 C28 8 12 24 12 50 C12 76 28 92 50 92 Z" fill="#1448D0" />
      {/* Right face half (lighter) */}
      <path d="M50 8 C72 8 88 24 88 50 C88 76 72 92 50 92 Z" fill="#4A90E8" />
      {/* Face oval */}
      <ellipse cx="50" cy="54" rx="30" ry="34" fill="white" />
      {/* Forehead curve */}
      <path d="M20 50 Q50 14 80 50" fill="white" />
      {/* Left eye — warm blue */}
      <ellipse cx="38" cy="46" rx="5.5" ry="7" fill="#3A78F6" />
      <ellipse cx="39" cy="44" rx="2" ry="2.5" fill="white" opacity="0.6" />
      {/* Right eye — dark blue */}
      <ellipse cx="62" cy="46" rx="5.5" ry="7" fill="#1448D0" />
      <ellipse cx="63" cy="44" rx="2" ry="2.5" fill="white" opacity="0.6" />
      {/* Smile */}
      <path
        d="M36 62 Q50 74 64 62"
        stroke="#1448D0"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SafariDockIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      {/* Outer ring */}
      <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" fill="none" />
      {/* Tick marks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 50 + 40 * Math.sin(rad);
        const y1 = 50 - 40 * Math.cos(rad);
        const x2 = 50 + 44 * Math.sin(rad);
        const y2 = 50 - 44 * Math.cos(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />;
      })}
      {/* Compass needle — north (red) */}
      <polygon points="50,12 46,50 54,50" fill="#FF3B30" />
      {/* Compass needle — south (white) */}
      <polygon points="50,88 54,50 46,50" fill="white" />
      {/* Centre circle */}
      <circle cx="50" cy="50" r="5" fill="white" />
      <circle cx="50" cy="50" r="2.5" fill="#006AFF" />
      {/* Cardinal labels */}
      <text x="50" y="9"  textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">N</text>
      <text x="50" y="97" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">S</text>
      <text x="7"  y="54" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">W</text>
      <text x="93" y="54" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">E</text>
    </svg>
  );
}

export function TerminalDockIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      {/* Chevron prompt > */}
      <polyline
        points="14,34 42,50 14,66"
        fill="none"
        stroke="#00F566"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cursor bar _ */}
      <rect x="50" y="63" width="36" height="6" rx="3" fill="#00F566" />
    </svg>
  );
}

export function TrashDockIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      {/* Handle */}
      <rect x="40" y="8" width="20" height="11" rx="4" fill="white" opacity="0.9" />
      {/* Lid */}
      <rect x="18" y="18" width="64" height="9" rx="4.5" fill="white" />
      {/* Body */}
      <path d="M24 29 L29 88 Q29 92 33 92 H67 Q71 92 71 88 L76 29 Z" fill="white" opacity="0.95" />
      {/* Vertical ribs */}
      <line x1="42" y1="36" x2="40" y2="84" stroke="rgba(120,120,140,0.45)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="36" x2="50" y2="84" stroke="rgba(120,120,140,0.45)" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="36" x2="60" y2="84" stroke="rgba(120,120,140,0.45)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Productivity / macOS system ──────────────────────────────────────────────

export function AppStoreIcon({ size = 24, className }: IconProps) {
  // White "A" pencil strokes — blue gradient tile provides background
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      {/* Left and right strokes of the "A" */}
      <polyline
        points="14,80 50,15 86,80"
        fill="none"
        stroke="white"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crossbar */}
      <line x1="30" y1="55" x2="70" y2="55" stroke="white" strokeWidth="11" strokeLinecap="round" />
    </svg>
  );
}

export function LaunchpadIcon({ size = 24, className }: IconProps) {
  // Search bar + 3×3 grid of coloured app squares
  const GRID_COLORS = [
    '#FF6B9D', '#FF3B30', '#FF9500',
    '#34C759', '#00C7BE', '#AF52DE',
    '#5856D6', '#007AFF', '#FF2D55',
  ];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      {/* Search pill */}
      <rect x="10" y="8" width="80" height="20" rx="10" fill="rgba(120,120,130,0.45)" />
      <circle cx="26" cy="18" r="5.5" fill="none" stroke="rgba(80,80,90,0.9)" strokeWidth="2.5" />
      <line x1="30" y1="22" x2="34" y2="26" stroke="rgba(80,80,90,0.9)" strokeWidth="2.5" strokeLinecap="round" />
      {/* 3 × 3 icon grid */}
      {GRID_COLORS.map((fill, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <rect
            key={i}
            x={13 + col * 26}
            y={36 + row * 21}
            width="18"
            height="18"
            rx="5"
            fill={fill}
          />
        );
      })}
    </svg>
  );
}

export function MailDockIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      {/* Envelope body */}
      <rect x="8" y="26" width="84" height="54" rx="9" fill="white" />
      {/* V-fold crease */}
      <path
        d="M8 32 L50 58 L92 32"
        fill="none"
        stroke="rgba(28,100,210,0.3)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Gear geometry helper — computes 12-tooth gear body + centre hole (evenodd)
function buildGearPath(): string {
  const cx = 50, cy = 50, outerR = 44, innerR = 31, n = 12;
  const holeR = 15;
  const step = (Math.PI * 2) / n;
  const half = step * 0.22;
  const pts: string[] = [];

  for (let i = 0; i < n; i++) {
    const a = step * i - Math.PI / 2;
    const p = (r: number, ang: number) =>
      `${(cx + r * Math.cos(ang)).toFixed(2)},${(cy + r * Math.sin(ang)).toFixed(2)}`;
    pts.push(
      `${i === 0 ? 'M' : 'L'}${p(innerR, a - step / 2 + half)}`,
      `L${p(outerR, a - half)}`,
      `L${p(outerR, a + half)}`,
      `L${p(innerR, a + step / 2 - half)}`,
    );
  }
  pts.push('Z');
  // Counter-clockwise circle for centre hole (evenodd makes it transparent)
  pts.push(
    `M${(cx + holeR).toFixed(2)},${cy}`,
    `A${holeR},${holeR} 0 1,0 ${(cx + holeR - 0.01).toFixed(2)},${cy}`,
    'Z',
  );
  return pts.join(' ');
}
const GEAR_PATH = buildGearPath();

export function SettingsDockIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <path d={GEAR_PATH} fill="rgba(230,230,235,0.95)" fillRule="evenodd" />
    </svg>
  );
}

export function PreviewDockIcon({ size = 24, className }: IconProps) {
  // Dark camera lens — blue tile provides the surrounding sky colour
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      {/* Outer lens barrel */}
      <circle cx="50" cy="50" r="38" fill="rgba(0,0,0,0.55)" />
      {/* Barrel ring highlight */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
      {/* Mid ring */}
      <circle cx="50" cy="50" r="27" fill="rgba(0,0,0,0.75)" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      {/* Inner glass */}
      <circle cx="50" cy="50" r="17" fill="#0B1A38" />
      {/* Lens flare highlight */}
      <ellipse cx="40" cy="40" rx="7" ry="4.5" fill="white" opacity="0.18" transform="rotate(-35,40,40)" />
    </svg>
  );
}

export function NotesDockIcon({ size = 24, className }: IconProps) {
  // Three horizontal ruled lines — yellow tile provides the notepad colour
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <line x1="22" y1="37" x2="78" y2="37" stroke="rgba(160,120,0,0.65)" strokeWidth="6.5" strokeLinecap="round" />
      <line x1="22" y1="52" x2="78" y2="52" stroke="rgba(160,120,0,0.65)" strokeWidth="6.5" strokeLinecap="round" />
      <line x1="22" y1="67" x2="55" y2="67" stroke="rgba(160,120,0,0.65)" strokeWidth="6.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Image-based icons ─────────────────────────────────────────────────────────

export function FinderImageIcon({ size = 24, className }: IconProps) {
  return (
    <Image
      src="/Finder.jpeg"
      alt="Finder"
      width={size || 24}
      height={size || 24}
      className={className}
      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
    />
  );
}

export function TerminalImageIcon({ size = 24, className }: IconProps) {
  return (
    <Image
      src="/Terminalicon3.png"
      alt="Terminal"
      width={size || 24}
      height={size || 24}
      className={className}
      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
    />
  );
}

export function SafariImageIcon({ size = 24, className }: IconProps) {
  return (
    <Image
      src="/Safari.jpg"
      alt="Safari"
      width={size || 24}
      height={size || 24}
      className={className}
      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
    />
  );
}

export function ClaudeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none">
      {/* Anthropic "A" mark — simplified geometric bars */}
      <rect x="22" y="28" width="14" height="44" rx="5" fill="white" fillOpacity="0.95"/>
      <rect x="43" y="28" width="14" height="44" rx="5" fill="white" fillOpacity="0.95"/>
      <rect x="64" y="28" width="14" height="44" rx="5" fill="white" fillOpacity="0.95"/>
      {/* Top connecting bar */}
      <rect x="22" y="28" width="56" height="14" rx="5" fill="white" fillOpacity="0.95"/>
      {/* Middle bar */}
      <rect x="22" y="50" width="56" height="10" rx="4" fill="white" fillOpacity="0.60"/>
    </svg>
  );
}
