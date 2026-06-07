"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type LineKind = 'input' | 'output' | 'error';

interface Line {
  id: number;
  kind: LineKind;
  text: string;
}

type CmdResult = { kind: 'output' | 'error'; text: string } | 'CLEAR';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

let counter = 0;
const uid = () => ++counter;

const PROMPT = 'aryan@portfolio ~ % ';

function buildNeofetch(): string {
  const logo = [
    '       ██████████      ',
    '     ██████████████    ',
    '    ███            ███ ',
    '   ███  ████████  ███  ',
    '  ███  ████████████ ███',
    '  ███  ████████████ ███',
    '   ███  ████████  ███  ',
    '    ███            ███ ',
    '     ██████████████    ',
    '       ██████████      ',
    '                       ',
    '                       ',
  ];
  const now = new Date();
  const uptimeMin = now.getHours() * 60 + now.getMinutes();
  const info: string[] = [
    'aryan @ portfolio-os',
    '──────────────────────────────────',
    'OS:       Portfolio macOS 1.0.0',
    'Host:     MacBook Pro (Virtual)',
    'Kernel:   Next.js 16.2.6',
    `Uptime:   ${uptimeMin}m`,
    'Packages: npm (312)',
    'Shell:    zsh 5.9.0',
    'WM:       Framer Motion 12',
    'Terminal: Portfolio.app',
    'CPU:      Brain (8-core) @ ∞GHz',
    'Memory:   ∞ / ∞ GB',
  ];
  return logo.map((l, i) => `${l}  ${info[i] ?? ''}`).join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Command registry
// ─────────────────────────────────────────────────────────────────────────────

const COMMANDS: Record<string, (args: string[]) => CmdResult> = {
  help: () => ({
    kind: 'output',
    text: [
      '',
      '  AVAILABLE COMMANDS',
      '  ──────────────────────────────────────────────',
      '  whoami      About me',
      '  skills      My tech stack',
      '  projects    My projects',
      '  contact     Contact information',
      '  ls          List directory contents',
      '  pwd         Current directory',
      '  date        Current date & time',
      '  echo        Print text',
      '  neofetch    System information',
      '  clear       Clear terminal',
      '  ──────────────────────────────────────────────',
      '',
    ].join('\n'),
  }),

  whoami: () => ({
    kind: 'output',
    text: [
      '',
      '  Aryan Singh',
      '  ──────────────────────────────────────────────',
      '  Role:     Full Stack Software Engineer',
      '  Status:   CS Student & Builder',
      '  Location: India 🇮🇳',
      '  Passion:  Building elegant software',
      '',
    ].join('\n'),
  }),

  skills: () => ({
    kind: 'output',
    text: [
      '',
      '  TECH STACK',
      '  ──────────────────────────────────────────────',
      '  Languages   TypeScript · Python · Java · C++',
      '  Frontend    React · Next.js · Tailwind · Framer',
      '  Backend     Node.js · Express · FastAPI',
      '  Databases   PostgreSQL · MongoDB · Redis',
      '  Cloud       AWS · Docker · Vercel',
      '  ──────────────────────────────────────────────',
      '',
    ].join('\n'),
  }),

  projects: () => ({
    kind: 'output',
    text: [
      '',
      '  PROJECTS',
      '  ──────────────────────────────────────────────',
      '  [1]  Portfolio OS',
      "       macOS-style interactive portfolio website",
      '       Stack: Next.js · Framer Motion · Zustand',
      "       → You're inside it right now!",
      '',
      '  [2]  More coming soon...',
      '  ──────────────────────────────────────────────',
      '',
    ].join('\n'),
  }),

  contact: () => ({
    kind: 'output',
    text: [
      '',
      '  CONTACT',
      '  ──────────────────────────────────────────────',
      '  Email       aryan.en.1142@gmail.com',
      '  GitHub      github.com/Aryan-en',
      '  LinkedIn    linkedin.com/in/aryan-singh-46130631a',
      '  LeetCode    leetcode.com/u/Aryan_1142',
      '  Instagram   instagram.com/aryaan.uu',
      '  ──────────────────────────────────────────────',
      '',
    ].join('\n'),
  }),

  ls: () => ({
    kind: 'output',
    text: '\nDesktop/   Documents/   Downloads/   Projects/   README.md   .zshrc\n',
  }),

  pwd: () => ({ kind: 'output', text: '/Users/aryan' }),

  date: () => ({
    kind: 'output',
    text: new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  }),

  echo: (args) => ({ kind: 'output', text: args.join(' ') }),

  neofetch: () => ({ kind: 'output', text: buildNeofetch() }),

  clear: () => 'CLEAR',
};

// ─────────────────────────────────────────────────────────────────────────────
// Welcome banner
// ─────────────────────────────────────────────────────────────────────────────

const WELCOME_TEXT = [
  '',
  '  ╔══════════════════════════════════════════════╗',
  '  ║      Portfolio OS Terminal  —  v1.0.0        ║',
  '  ║      Built by Aryan Singh                    ║',
  '  ║      Type "help" for available commands      ║',
  '  ╚══════════════════════════════════════════════╝',
  '',
].join('\n');

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([
    { id: uid(), kind: 'output', text: WELCOME_TEXT },
  ]);
  const [input, setInput]     = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Auto-scroll and auto-focus
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setLines(prev => [...prev, { id: uid(), kind: 'input', text: '' }]);
      return;
    }

    const [cmd, ...args] = trimmed.split(/\s+/);
    const result = COMMANDS[cmd.toLowerCase()]?.(args);

    setLines(prev => {
      const next: Line[] = [
        ...prev,
        { id: uid(), kind: 'input', text: trimmed },
      ];

      if (!result) {
        next.push({
          id: uid(),
          kind: 'error',
          text: `zsh: command not found: ${cmd}`,
        });
      } else if (result === 'CLEAR') {
        return [];
      } else {
        next.push({ id: uid(), kind: result.kind, text: result.text });
      }

      return next;
    });

    setHistory(prev => [trimmed, ...prev].slice(0, 80));
    setHistIdx(-1);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx <= 0) {
        setHistIdx(-1);
        setInput('');
      } else {
        const next = histIdx - 1;
        setHistIdx(next);
        setInput(history[next] ?? '');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      className="flex flex-col w-full h-full overflow-hidden cursor-text select-text"
      style={{ background: '#0C0C0C', fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Scrollable output ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 scrollbar-thin">
        {lines.map(line => (
          <pre
            key={line.id}
            className="whitespace-pre-wrap break-words leading-[1.7] text-[12.5px] m-0"
            style={{
              color:
                line.kind === 'input'
                  ? '#E8E8E8'
                  : line.kind === 'error'
                  ? '#FF5F57'
                  : '#86EFAC',
            }}
          >
            {line.kind === 'input' && (
              <span style={{ color: '#00FF41', userSelect: 'none' }}>{PROMPT}</span>
            )}
            {line.text}
          </pre>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Input row ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center px-4 pb-3 pt-1 gap-0 flex-shrink-0 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <span
          className="whitespace-nowrap text-[12.5px] select-none flex-shrink-0"
          style={{ color: '#00FF41' }}
        >
          {PROMPT}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Terminal input"
          className="flex-1 bg-transparent outline-none text-[12.5px] border-none"
          style={{
            color: '#E8E8E8',
            caretColor: '#00FF41',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
