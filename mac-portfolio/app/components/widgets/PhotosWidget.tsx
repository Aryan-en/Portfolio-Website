"use client";

// Apple Photos pinwheel icon — 8 coloured petals
function PhotosIcon({ size = 64 }: { size?: number }) {
  const PETALS = [
    '#FF3B30', // red
    '#FF9500', // orange
    '#FFCC00', // yellow
    '#34C759', // green
    '#00C7BE', // teal
    '#007AFF', // blue
    '#BF5AF2', // purple
    '#FF2D55', // pink
  ];

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      {PETALS.map((fill, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="31"
          rx="10"
          ry="18"
          fill={fill}
          transform={`rotate(${i * 45}, 50, 50)`}
        />
      ))}
      {/* Centre highlight */}
      <circle cx="50" cy="50" r="7" fill="white" opacity="0.18" />
    </svg>
  );
}

export function PhotosWidget() {
  return (
    <div
      className="rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 p-5 select-none flex flex-col items-center justify-center gap-3"
      style={{ width: 452, minHeight: 140 }}
    >
      {/* Dark rounded tile, matching macOS Photos widget icon background */}
      <div className="w-[72px] h-[72px] rounded-[22%] bg-[#1C1C1E] flex items-center justify-center shadow-lg shadow-black/50">
        <PhotosIcon size={52} />
      </div>
      <p className="text-white/55 text-[12px] text-center leading-relaxed max-w-[280px]">
        Photos will appear here when they have finished processing
      </p>
    </div>
  );
}
