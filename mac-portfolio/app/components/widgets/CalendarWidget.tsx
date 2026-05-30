"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
] as const;

export function CalendarWidget() {
  const today = new Date();
  const [view, setView] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const yr  = view.getFullYear();
  const mo  = view.getMonth();
  const startOffset = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();

  const prev = () => setView(v => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const next = () => setView(v => new Date(v.getFullYear(), v.getMonth() + 1, 1));

  const isToday = (d: number) =>
    d === today.getDate() && mo === today.getMonth() && yr === today.getFullYear();

  const cells: (number | null)[] = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="w-[220px] rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-3 select-none">
      {/* Month + nav */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-[#FF3B30] text-[11px] font-bold tracking-widest uppercase">
          {MONTH_NAMES[mo].slice(0, 3)}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={prev}
            className="p-0.5 rounded text-white/40 hover:text-white transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={12} strokeWidth={2.5} />
          </button>
          <span className="text-white/40 text-[11px] w-10 text-center tabular-nums">{yr}</span>
          <button
            onClick={next}
            className="p-0.5 rounded text-white/40 hover:text-white transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-[3px]">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-white/35 text-[10px] font-medium py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-[2px]">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center h-[26px]">
            {day != null && (
              <span
                className={[
                  'w-[22px] h-[22px] flex items-center justify-center rounded-full text-[11px]',
                  'tabular-nums cursor-default transition-colors',
                  isToday(day)
                    ? 'bg-[#FF3B30] text-white font-semibold'
                    : 'text-white/80 hover:bg-white/10',
                ].join(' ')}
              >
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
