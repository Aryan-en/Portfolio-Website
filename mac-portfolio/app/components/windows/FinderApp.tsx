"use client";

import { useState } from 'react';
import {
  Clock, Share2, LayoutGrid, List, ChevronLeft, ChevronRight,
  Search, MoreHorizontal, Folder, FileText, Download, Home,
  HardDrive, Trash2, Cloud, Wifi, Monitor, Package, Tag,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'list' | 'columns' | 'gallery';
type FileKind = 'folder' | 'pdf' | 'app' | 'file' | 'code';

interface FsItem {
  id: string;
  name: string;
  kind: FileKind;
  size?: string;
  modified?: string;
  url?: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  tagColor?: string;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Fake filesystem
// ─────────────────────────────────────────────────────────────────────────────

const FS: Record<string, FsItem[]> = {
  recents: [
    { id: 'r1', name: 'Resume.pdf',    kind: 'pdf',    size: '234 KB', modified: 'Today'     },
    { id: 'r2', name: 'portfolio-os',  kind: 'folder',                 modified: 'Today'     },
    { id: 'r3', name: 'README.md',     kind: 'code',   size: '4 KB',   modified: 'Yesterday' },
  ],
  shared: [],
  applications: [
    { id: 'a1', name: 'Terminal',        kind: 'app' },
    { id: 'a2', name: 'Safari',          kind: 'app' },
    { id: 'a3', name: 'Notes',           kind: 'app' },
    { id: 'a4', name: 'Mail',            kind: 'app' },
    { id: 'a5', name: 'Preview',         kind: 'app' },
    { id: 'a6', name: 'System Settings', kind: 'app' },
  ],
  desktop: [
    { id: 'd1', name: 'Portfolio OS', kind: 'folder', modified: 'Today' },
  ],
  documents: [
    { id: 'doc1',     name: 'Resume.pdf',       kind: 'pdf',    size: '234 KB', modified: 'Jun 5'  },
    { id: 'projects', name: 'Projects',         kind: 'folder',                 modified: 'Jun 4'  },
    { id: 'doc3',     name: 'Cover Letter.pdf', kind: 'pdf',    size: '128 KB', modified: 'May 28' },
    { id: 'doc4',     name: 'Notes',            kind: 'folder',                 modified: 'Jun 3'  },
  ],
  projects: [
    { id: 'p1',  name: 'ISL_translator',         kind: 'code', size: '24 MB',  modified: 'Jun 1',  url: 'https://github.com/Aryan-en/ISL_translator'         },
    { id: 'p2',  name: 'AutoDesk_Img_to_CAD',    kind: 'code', size: '18 MB',  modified: 'May 28', url: 'https://github.com/Aryan-en/AutoDesk_Img_to_CAD'    },
    { id: 'p3',  name: 'CommisPro',              kind: 'code', size: '12 MB',  modified: 'May 20', url: 'https://github.com/Aryan-en/CommisPro'              },
    { id: 'p4',  name: 'PEC_APP_Platform',       kind: 'code', size: '31 MB',  modified: 'May 15', url: 'https://github.com/Aryan-en/PEC_APP_Platform'       },
    { id: 'p5',  name: 'Matcha-AI-DTU',          kind: 'code', size: '9 MB',   modified: 'Apr 30', url: 'https://github.com/Aryan-en/Matcha-AI-DTU'          },
    { id: 'p6',  name: 'CommissionAI_KloudStax', kind: 'code', size: '16 MB',  modified: 'Apr 22', url: 'https://github.com/Aryan-en/CommissionAI_KloudStax' },
    { id: 'p7',  name: 'DataForge_Finals',       kind: 'code', size: '8 MB',   modified: 'Apr 10', url: 'https://github.com/Aryan-en/DataForge_Finals'       },
    { id: 'p8',  name: 'Lotify-Flutter',         kind: 'code', size: '22 MB',  modified: 'Mar 28', url: 'https://github.com/Aryan-en/Lotify-Flutter'         },
    { id: 'p9',  name: 'gramin-saathi',          kind: 'code', size: '14 MB',  modified: 'Mar 15', url: 'https://github.com/Aryan-en/gramin-saathi'          },
    { id: 'p10', name: 'KDSH_2026_Hackthon',     kind: 'code', size: '11 MB',  modified: 'Feb 28', url: 'https://github.com/Aryan-en/KDSH_2026_Hackthon'     },
  ],
  downloads: [
    { id: 'dl1', name: 'node-v20.tar.gz', kind: 'file', size: '48 MB', modified: 'Jun 1' },
  ],
  icloud: [
    { id: 'ic1', name: 'Desktop',   kind: 'folder' },
    { id: 'ic2', name: 'Documents', kind: 'folder' },
  ],
  home: [
    { id: 'h1', name: 'Desktop',   kind: 'folder' },
    { id: 'h2', name: 'Documents', kind: 'folder' },
    { id: 'h3', name: 'Downloads', kind: 'folder' },
    { id: 'h4', name: 'Projects',  kind: 'folder' },
    { id: 'h5', name: 'Music',     kind: 'folder' },
    { id: 'h6', name: 'Pictures',  kind: 'folder' },
  ],
  macintosh: [
    { id: 'm1', name: 'Applications', kind: 'folder' },
    { id: 'm2', name: 'Users',        kind: 'folder' },
    { id: 'm3', name: 'Library',      kind: 'folder' },
    { id: 'm4', name: 'System',       kind: 'folder' },
  ],
  airdrop: [],
  bin:     [],
};

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar config
// ─────────────────────────────────────────────────────────────────────────────

const si = (id: string, label: string, icon: React.ReactNode): SidebarItem => ({ id, label, icon });

const SECTIONS: SidebarSection[] = [
  {
    items: [
      si('recents', 'Recents', <Clock   size={14} strokeWidth={1.6} />),
      si('shared',  'Shared',  <Share2  size={14} strokeWidth={1.6} />),
    ],
  },
  {
    title: 'Favourites',
    items: [
      si('applications', 'Applications', <Package  size={14} strokeWidth={1.6} />),
      si('desktop',      'Desktop',      <Monitor  size={14} strokeWidth={1.6} />),
      si('documents',    'Documents',    <FileText size={14} strokeWidth={1.6} />),
      si('downloads',    'Downloads',    <Download size={14} strokeWidth={1.6} />),
    ],
  },
  {
    title: 'Locations',
    items: [
      si('icloud',    'iCloud Drive', <Cloud    size={14} strokeWidth={1.6} />),
      si('home',      'aryansingh',   <Home     size={14} strokeWidth={1.6} />),
      si('macintosh', 'Macintosh HD', <HardDrive size={14} strokeWidth={1.6} />),
      si('airdrop',   'AirDrop',      <Wifi     size={14} strokeWidth={1.6} />),
      si('bin',       'Bin',          <Trash2   size={14} strokeWidth={1.6} />),
    ],
  },
  {
    title: 'Tags',
    items: [
      { id: 'tag-red',    label: 'Red',    tagColor: '#FF3B30' },
      { id: 'tag-orange', label: 'Orange', tagColor: '#FF9500' },
      { id: 'tag-yellow', label: 'Yellow', tagColor: '#FFCC00' },
      { id: 'tag-green',  label: 'Green',  tagColor: '#34C759' },
      { id: 'tag-blue',   label: 'Blue',   tagColor: '#007AFF' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// File / folder icons
// ─────────────────────────────────────────────────────────────────────────────

function MacFolder({ size = 48 }: { size?: number }) {
  // Approximates the macOS blue folder shape
  const w = size, h = size * 0.85;
  return (
    <svg width={w} height={h} viewBox="0 0 56 48" fill="none">
      {/* Tab */}
      <path d="M2 10C2 7.8 3.8 6 6 6H20L24 12H2V10Z" fill="#5AADFF" />
      {/* Body */}
      <rect x="2" y="12" width="52" height="34" rx="4" fill="#5AADFF" />
      {/* Sheen */}
      <rect x="2" y="12" width="52" height="10" rx="4" fill="white" fillOpacity="0.18" />
    </svg>
  );
}

function GridItemIcon({ kind, size = 46 }: { kind: FileKind; size?: number }) {
  switch (kind) {
    case 'folder':
      return <MacFolder size={size} />;
    case 'pdf':
      return (
        <div
          className="rounded-[10px] flex flex-col items-end justify-start overflow-hidden shadow-md"
          style={{ width: size * 0.8, height: size, background: 'white' }}
        >
          <div className="w-full flex-1 flex flex-col justify-end items-center pb-2">
            <div
              className="w-full py-1 flex items-center justify-center"
              style={{ background: '#FF3B30' }}
            >
              <span className="text-white font-bold tracking-wide" style={{ fontSize: size * 0.2 }}>PDF</span>
            </div>
          </div>
        </div>
      );
    case 'app':
      return (
        <div
          className="rounded-[12px] flex items-center justify-center shadow-md"
          style={{ width: size, height: size, background: 'linear-gradient(145deg,#48484A,#2C2C2E)' }}
        >
          <Package size={size * 0.45} color="white" strokeWidth={1.5} />
        </div>
      );
    case 'code':
      return (
        <div
          className="rounded-[10px] flex flex-col items-center justify-center gap-1"
          style={{
            width: size, height: size,
            background: 'linear-gradient(145deg,#1C1C1E,#2C2C2E)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          {/* GitHub-style repo icon */}
          <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="white" fillOpacity="0.9">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </div>
      );
    default:
      return (
        <div
          className="rounded-[8px] flex items-center justify-center"
          style={{ width: size * 0.78, height: size, background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}
        >
          <FileText size={size * 0.4} color="#8E8E93" strokeWidth={1.5} />
        </div>
      );
  }
}

function ListItemIcon({ kind }: { kind: FileKind }) {
  const s = 16;
  switch (kind) {
    case 'folder': return <Folder size={s} color="#5AADFF" fill="#5AADFF" strokeWidth={0} />;
    case 'pdf':    return <FileText size={s} color="#FF3B30" strokeWidth={1.5} />;
    case 'app':    return <Package  size={s} color="#8E8E93" strokeWidth={1.5} />;
    case 'code':   return <FileText size={s} color="#1D6FE2" strokeWidth={1.5} />;
    default:       return <FileText size={s} color="#8E8E93" strokeWidth={1.5} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar icons (pixel-matched to macOS Finder)
// ─────────────────────────────────────────────────────────────────────────────

function IconGridSVG({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill={active ? '#FFF' : 'rgba(255,255,255,0.55)'} />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill={active ? '#FFF' : 'rgba(255,255,255,0.55)'} />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill={active ? '#FFF' : 'rgba(255,255,255,0.55)'} />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill={active ? '#FFF' : 'rgba(255,255,255,0.55)'} />
    </svg>
  );
}

function IconListSVG({ active }: { active: boolean }) {
  const c = active ? '#FFF' : 'rgba(255,255,255,0.55)';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="2"  width="10" height="2" rx="1" fill={c} />
      <rect x="1" y="2"  width="2"  height="2" rx="0.5" fill={c} />
      <rect x="5" y="7"  width="10" height="2" rx="1" fill={c} />
      <rect x="1" y="7"  width="2"  height="2" rx="0.5" fill={c} />
      <rect x="5" y="12" width="10" height="2" rx="1" fill={c} />
      <rect x="1" y="12" width="2"  height="2" rx="0.5" fill={c} />
    </svg>
  );
}

function IconColumnsSVG({ active }: { active: boolean }) {
  const c = active ? '#FFF' : 'rgba(255,255,255,0.55)';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1"  y="1" width="4" height="14" rx="1" fill={c} />
      <rect x="6"  y="1" width="4" height="14" rx="1" fill={c} />
      <rect x="11" y="1" width="4" height="14" rx="1" fill={c} />
    </svg>
  );
}

function IconGallerySVG({ active }: { active: boolean }) {
  const c = active ? '#FFF' : 'rgba(255,255,255,0.55)';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="9" rx="1.5" fill={c} />
      <rect x="1" y="12" width="4" height="3" rx="1" fill={c} />
      <rect x="6" y="12" width="4" height="3" rx="1" fill={c} />
      <rect x="11" y="12" width="4" height="3" rx="1" fill={c} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function FinderApp() {
  const [selected, setSelected]     = useState<string>('shared');
  const [viewMode, setViewMode]     = useState<ViewMode>('grid');
  const [history, setHistory]       = useState<string[]>(['shared']);
  const [histIdx, setHistIdx]       = useState<number>(0);
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching]   = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const items = (FS[selected] ?? []).filter(
    it => !searchText || it.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const navigate = (id: string) => {
    const next = history.slice(0, histIdx + 1);
    next.push(id);
    setHistory(next);
    setHistIdx(next.length - 1);
    setSelected(id);
    setActiveFile(null);
  };

  const goBack = () => {
    if (histIdx > 0) {
      const prev = history[histIdx - 1];
      setHistIdx(h => h - 1);
      setSelected(prev);
      setActiveFile(null);
    }
  };

  const goForward = () => {
    if (histIdx < history.length - 1) {
      const next = history[histIdx + 1];
      setHistIdx(h => h + 1);
      setSelected(next);
      setActiveFile(null);
    }
  };

  const currentLabel =
    SECTIONS.flatMap(s => s.items).find(i => i.id === selected)?.label ?? 'Finder';

  // ── View buttons ────────────────────────────────────────────────────────────
  const VIEW_BTNS: { mode: ViewMode; el: (a: boolean) => React.ReactNode }[] = [
    { mode: 'grid',    el: (a) => <IconGridSVG active={a} />    },
    { mode: 'list',    el: (a) => <IconListSVG active={a} />    },
    { mode: 'columns', el: (a) => <IconColumnsSVG active={a} /> },
    { mode: 'gallery', el: (a) => <IconGallerySVG active={a} /> },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col w-full h-full select-none overflow-hidden"
      style={{ background: '#1E1E1E', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
    >
      {/* ── Finder toolbar ────────────────────────────────────────────────── */}
      <div
        className="flex items-center h-[46px] px-3 gap-2 flex-shrink-0 border-b"
        style={{ background: '#2D2D2D', borderColor: 'rgba(0,0,0,0.45)' }}
      >
        {/* Back / Forward */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={goBack}
            disabled={histIdx === 0}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-100 disabled:opacity-30 cursor-default"
            style={{ color: 'rgba(255,255,255,0.80)' }}
            onMouseEnter={e => { if (histIdx > 0) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <button
            onClick={goForward}
            disabled={histIdx >= history.length - 1}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-100 disabled:opacity-30 cursor-default"
            style={{ color: 'rgba(255,255,255,0.80)' }}
            onMouseEnter={e => { if (histIdx < history.length - 1) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Title — centred */}
        <span
          className="flex-1 text-center text-[14px] font-semibold truncate"
          style={{ color: 'rgba(255,255,255,0.88)' }}
        >
          {currentLabel}
        </span>

        {/* View mode switcher */}
        <div
          className="flex items-center rounded-md overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {VIEW_BTNS.map(({ mode, el }, i) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="w-[30px] h-[26px] flex items-center justify-center cursor-default transition-colors duration-100"
              style={{
                background: viewMode === mode ? 'rgba(255,255,255,0.15)' : 'transparent',
                borderRight: i < VIEW_BTNS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}
            >
              {el(viewMode === mode)}
            </button>
          ))}
        </div>

        {/* Group / sort button */}
        <button
          className="flex items-center gap-1 h-[26px] px-2 rounded-md text-[11px] font-medium cursor-default transition-colors duration-100"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.70)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="rgba(255,255,255,0.55)" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="rgba(255,255,255,0.55)" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="rgba(255,255,255,0.55)" />
            <rect x="8" y="8" width="2" height="2" rx="0.5" fill="rgba(255,255,255,0.30)" />
          </svg>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Toolbar right icons */}
        <div className="flex items-center gap-0.5 ml-0.5">
          {[
            { icon: <Share2 size={15} strokeWidth={1.8} />,        label: 'Share' },
            { icon: <Tag    size={15} strokeWidth={1.8} />,        label: 'Tag'   },
            { icon: <MoreHorizontal size={15} strokeWidth={1.8} />, label: 'More'  },
          ].map(({ icon, label }) => (
            <button
              key={label}
              title={label}
              className="w-7 h-7 flex items-center justify-center rounded-md cursor-default transition-colors duration-100"
              style={{ color: 'rgba(255,255,255,0.65)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {icon}
            </button>
          ))}

          {/* Search */}
          {searching ? (
            <div
              className="flex items-center gap-1 h-[26px] px-2 rounded-md"
              style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)', width: 140 }}
            >
              <Search size={12} color="rgba(255,255,255,0.50)" strokeWidth={2} />
              <input
                autoFocus
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') { setSearching(false); setSearchText(''); } }}
                placeholder="Search"
                className="flex-1 bg-transparent outline-none text-[12px]"
                style={{ color: 'rgba(255,255,255,0.88)' }}
              />
            </div>
          ) : (
            <button
              onClick={() => setSearching(true)}
              className="w-7 h-7 flex items-center justify-center rounded-md cursor-default"
              style={{ color: 'rgba(255,255,255,0.65)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Search size={15} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

      {/* ── Body: sidebar + content ────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div
          className="flex flex-col overflow-y-auto flex-shrink-0 py-2"
          style={{ width: 210, background: '#252527', borderRight: '1px solid rgba(0,0,0,0.4)' }}
        >
          {SECTIONS.map((section, si) => (
            <div key={si} className="mb-1">
              {section.title && (
                <div
                  className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'rgba(255,255,255,0.32)', letterSpacing: '0.06em' }}
                >
                  {section.title}
                </div>
              )}
              {section.items.map(item => {
                const isActive = selected === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className="w-full flex items-center gap-2 px-3 py-[5px] text-left cursor-default transition-colors duration-100 rounded-md mx-0.5"
                    style={{
                      background: isActive ? '#3577DB' : 'transparent',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.78)',
                      width: 'calc(100% - 4px)',
                      marginLeft: 2,
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    {item.tagColor ? (
                      <span
                        className="w-[10px] h-[10px] rounded-full flex-shrink-0"
                        style={{ background: item.tagColor }}
                      />
                    ) : (
                      <span
                        className="flex-shrink-0"
                        style={{ color: isActive ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.55)' }}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="text-[12.5px] font-[400] truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Content area */}
        <div
          className="flex-1 overflow-auto"
          style={{ background: '#1E1E1E' }}
          onClick={() => setActiveFile(null)}
        >
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Folder size={56} color="rgba(255,255,255,0.12)" fill="rgba(255,255,255,0.08)" strokeWidth={1} />
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {searching && searchText ? `No results for "${searchText}"` : 'No items'}
              </p>
            </div>

          ) : viewMode === 'grid' ? (
            /* Icon / grid view */
            <div className="flex flex-wrap content-start gap-1 p-4">
              {items.map(item => (
                <button
                  key={item.id}
                  onDoubleClick={() => {
                    if (item.kind === 'folder') navigate(item.id);
                    else if (item.url) window.open(item.url, '_blank');
                  }}
                  onClick={e => { e.stopPropagation(); setActiveFile(item.id); }}
                  className="flex flex-col items-center gap-1.5 py-2 px-1 rounded-[8px] cursor-default transition-colors duration-100"
                  style={{
                    width: 82,
                    background: activeFile === item.id ? 'rgba(53,119,219,0.55)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (activeFile !== item.id)
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={e => {
                    if (activeFile !== item.id)
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <GridItemIcon kind={item.kind} size={46} />
                  <span
                    className="text-[11px] text-center leading-tight w-full px-0.5 line-clamp-2 break-words"
                    style={{ color: activeFile === item.id ? '#fff' : 'rgba(255,255,255,0.85)' }}
                  >
                    {item.name}
                  </span>
                </button>
              ))}
            </div>

          ) : (
            /* List view */
            <div className="flex flex-col">
              {/* Column headers */}
              <div
                className="flex items-center h-[22px] px-4 border-b text-[11px] font-medium sticky top-0 flex-shrink-0"
                style={{ background: '#252527', borderColor: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.40)' }}
              >
                <span className="flex-1">Name</span>
                <span className="w-[96px] text-right">Date Modified</span>
                <span className="w-[72px] text-right">Size</span>
                <span className="w-[72px] text-right">Kind</span>
              </div>
              {items.map(item => (
                <button
                  key={item.id}
                  onDoubleClick={() => {
                    if (item.kind === 'folder') navigate(item.id);
                    else if (item.url) window.open(item.url, '_blank');
                  }}
                  onClick={e => { e.stopPropagation(); setActiveFile(item.id); }}
                  className="flex items-center h-[22px] px-4 gap-2 cursor-default transition-colors duration-75"
                  style={{
                    background: activeFile === item.id ? '#3577DB' : 'transparent',
                    color: activeFile === item.id ? '#fff' : 'rgba(255,255,255,0.82)',
                  }}
                  onMouseEnter={e => {
                    if (activeFile !== item.id)
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={e => {
                    if (activeFile !== item.id)
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span className="flex-shrink-0"><ListItemIcon kind={item.kind} /></span>
                  <span className="flex-1 text-[12px] text-left truncate">{item.name}</span>
                  <span className="w-[96px] text-right text-[11px] opacity-50">{item.modified ?? '—'}</span>
                  <span className="w-[72px] text-right text-[11px] opacity-50">{item.size ?? '—'}</span>
                  <span className="w-[72px] text-right text-[11px] capitalize opacity-50">{item.kind}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-center h-[22px] flex-shrink-0 border-t text-[11px]"
        style={{ background: '#252527', borderColor: 'rgba(0,0,0,0.40)', color: 'rgba(255,255,255,0.30)' }}
      >
        {items.length === 0 ? '0 items' : `${items.length} ${items.length === 1 ? 'item' : 'items'}`}
      </div>
    </div>
  );
}
