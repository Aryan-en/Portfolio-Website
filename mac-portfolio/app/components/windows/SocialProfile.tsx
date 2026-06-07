"use client";

import { useState, useEffect } from 'react';
import { ExternalLink, MapPin, Users, BookOpen, Star, GitFork } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Shared button
// ─────────────────────────────────────────────────────────────────────────────

function OpenButton({
  url,
  label,
  bg,
}: {
  url: string;
  label: string;
  bg: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold shadow-lg active:brightness-90 transition-all duration-150 cursor-default"
      style={{ background: bg }}
    >
      <ExternalLink size={14} strokeWidth={2.5} />
      {label}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading / Error states
// ─────────────────────────────────────────────────────────────────────────────

function LoadingState({ bg }: { bg: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: bg }}>
      <div className="w-6 h-6 rounded-full border-[2.5px] border-white/10 border-t-white/60 animate-spin" />
      <p className="text-[12px] text-white/30">Loading profile…</p>
    </div>
  );
}

function ErrorState({ url, bg }: { url: string; bg: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ background: bg }}>
      <p className="text-[13px] font-medium text-white/40">Couldn&apos;t load profile data.</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white/70 text-[13px] hover:bg-white/15 transition-colors cursor-default"
      >
        <ExternalLink size={13} />
        Open in Browser
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GitHub card — fetches live data
// ─────────────────────────────────────────────────────────────────────────────

interface GHUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GHRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Python: '#3572A5',
  Java: '#B07219',
  'C++': '#F34B7D',
  Rust: '#DEA584',
  Go: '#00ADD8',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Shell: '#89E051',
};

function GitHubCard() {
  const [user, setUser]     = useState<GHUser | null>(null);
  const [repos, setRepos]   = useState<GHRepo[]>([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('https://api.github.com/users/Aryan-en').then(r => r.json()),
      fetch('https://api.github.com/users/Aryan-en/repos?sort=stars&per_page=4').then(r => r.json()),
    ])
      .then(([u, r]: [GHUser, GHRepo[]]) => {
        if ('message' in (u as object)) throw new Error();
        setUser(u);
        setRepos(Array.isArray(r) ? r : []);
        setLoad(false);
      })
      .catch(() => { setError(true); setLoad(false); });
  }, []);

  if (loading) return <LoadingState bg="#0D1117" />;
  if (error || !user) return <ErrorState url="https://github.com/Aryan-en" bg="#0D1117" />;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto" style={{ background: '#0D1117', color: '#C9D1D9' }}>

      {/* Profile header */}
      <div className="flex items-start gap-4 px-6 pt-6 pb-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {/* Avatar */}
        <div className="relative flex-shrink-0 w-[70px] h-[70px] rounded-full overflow-hidden border-2" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.avatar_url} alt={user.login} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h2 className="text-[18px] font-bold leading-tight" style={{ color: '#E6EDF3' }}>{user.name || user.login}</h2>
          <p className="text-[13px] mt-0.5 font-light" style={{ color: '#8B949E' }}>@{user.login}</p>
          {user.bio && (
            <p className="text-[12px] mt-2 leading-relaxed line-clamp-2" style={{ color: '#C9D1D9', opacity: 0.7 }}>
              {user.bio}
            </p>
          )}
          {user.location && (
            <div className="flex items-center gap-1 mt-2 text-[11px]" style={{ color: '#8B949E' }}>
              <MapPin size={11} />
              {user.location}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-stretch divide-x" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.06)' }}>
        {[
          { icon: <BookOpen size={11} />, label: 'Repos',     value: user.public_repos },
          { icon: <Users size={11} />,    label: 'Followers', value: user.followers    },
          { icon: null,                   label: 'Following', value: user.following    },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex-1 flex flex-col items-center py-3.5 gap-0.5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <span className="text-[17px] font-bold" style={{ color: '#E6EDF3' }}>{value}</span>
            <span className="text-[10px] flex items-center gap-1" style={{ color: '#8B949E' }}>
              {icon}{label}
            </span>
          </div>
        ))}
      </div>

      {/* Pinned repos */}
      {repos.length > 0 && (
        <div className="px-6 pt-4 pb-3">
          <h3 className="text-[10.5px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#8B949E' }}>
            Top Repositories
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {repos.map(repo => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1.5 p-3 rounded-lg transition-all duration-150 cursor-default"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'transparent' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(35,134,54,0.35)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[12px] font-semibold truncate flex-1" style={{ color: '#58A6FF' }}>{repo.name}</span>
                  <ExternalLink size={10} className="flex-shrink-0 mt-0.5" style={{ color: '#8B949E' }} />
                </div>
                {repo.description && (
                  <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: '#8B949E' }}>
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-2.5 mt-auto pt-1">
                  {repo.language && (
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: '#8B949E' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: LANG_COLORS[repo.language] ?? '#8B949E' }} />
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px]" style={{ color: '#8B949E' }}>
                      <Star size={9} /> {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px]" style={{ color: '#8B949E' }}>
                      <GitFork size={9} /> {repo.forks_count}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex justify-center pb-7 pt-3 mt-auto">
        <OpenButton url={user.html_url} label="View on GitHub" bg="#238636" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LeetCode card — styled static profile
// ─────────────────────────────────────────────────────────────────────────────

function LeetCodeCard() {
  const url  = 'https://leetcode.com/u/Aryan_1142/';
  const easy = 121, medium = 213, hard = 38;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto" style={{ background: '#1A1A1A', color: '#EBEBF5' }}>

      {/* Platform header */}
      <div className="px-6 pt-6 pb-4 border-b flex items-center gap-3" style={{ background: '#222', borderColor: 'rgba(255,255,255,0.06)' }}>
        {/* LC logo badge */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FFA116' }}>
          <svg viewBox="0 0 95 111" fill="none" className="w-5 h-5">
            <path d="M68.0 79.2L54 93.1c-1.9 1.9-4.4 2.9-7 2.9a9.9 9.9 0 01-9.9-9.9c0-2.6 1-5 2.9-6.9l17.7-17.1a4.6 4.6 0 000-6.4L40 38.4a4.6 4.6 0 000-6.4L23.2 15.1a9.9 9.9 0 010-14 9.9 9.9 0 0114 0l30.8 30c1.9 1.9 2.9 4.3 2.9 6.9a9.7 9.7 0 01-2.9 6.9z" fill="white"/>
            <path d="M68 32.7l-13 12.6a4.6 4.6 0 000 6.4l13 12.6c3.8 3.7 8.9 5.7 14.2 5.7a20 20 0 000-40c-5.3 0-10.4 1.9-14.2 5.7z" fill="white" opacity=".85"/>
          </svg>
        </div>
        <div>
          <h2 className="text-[16px] font-bold text-white/90">LeetCode</h2>
          <p className="text-[12px] text-white/35">Aryan_1142</p>
        </div>
      </div>

      {/* Avatar / username */}
      <div className="flex flex-col items-center py-7 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div
          className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-[28px] font-black text-white mb-3 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #FFA116 0%, #FF6B00 100%)' }}
        >
          A
        </div>
        <h3 className="text-[16px] font-semibold text-white/90">Aryan_1142</h3>
        <p className="text-[12px] mt-1.5 font-medium" style={{ color: '#FFA116' }}>Competitive Programmer</p>
      </div>

      {/* Problem stats */}
      <div className="px-6 py-5">
        <p className="text-[10.5px] font-semibold uppercase tracking-widest text-white/25 mb-4">Problems Solved</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Easy',   value: easy,   color: '#00B8A3', bg: 'rgba(0,184,163,0.07)',  border: 'rgba(0,184,163,0.18)'  },
            { label: 'Medium', value: medium, color: '#FFC01E', bg: 'rgba(255,192,30,0.07)', border: 'rgba(255,192,30,0.18)' },
            { label: 'Hard',   value: hard,   color: '#FF375F', bg: 'rgba(255,55,95,0.07)',  border: 'rgba(255,55,95,0.18)'  },
          ].map(({ label, value, color, bg, border }) => (
            <div
              key={label}
              className="flex flex-col items-center py-5 rounded-2xl"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <span className="text-[26px] font-black leading-none" style={{ color }}>{value}</span>
              <span className="text-[11px] font-medium mt-2" style={{ color: `${color}CC` }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className="mt-4 flex items-center justify-between px-5 py-3.5 rounded-xl"
          style={{ background: '#262626' }}
        >
          <span className="text-[12px] text-white/40">Total Solved</span>
          <span className="text-[18px] font-bold text-white/90">{easy + medium + hard}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center pb-8 mt-auto pt-2">
        <OpenButton url={url} label="View on LeetCode" bg="#FFA116" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LinkedIn card
// ─────────────────────────────────────────────────────────────────────────────

function LinkedInCard() {
  const url = 'https://www.linkedin.com/in/aryan-singh-46130631a/';

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto" style={{ background: '#F3F2EF' }}>

      {/* Blue cover */}
      <div className="relative h-[88px] flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)' }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 60%, white 1px, transparent 1px),' +
              'radial-gradient(circle at 75% 25%, white 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }}
        />
      </div>

      {/* Profile card */}
      <div className="relative bg-white border-b border-black/[0.08] px-6 pb-5">
        {/* Avatar (overlaps cover) */}
        <div
          className="w-[68px] h-[68px] rounded-full border-4 border-white flex items-center justify-center -mt-9 text-[26px] font-black text-white shadow-sm"
          style={{ background: 'linear-gradient(135deg, #0A66C2, #004182)' }}
        >
          A
        </div>

        <div className="mt-2.5">
          <h2 className="text-[18px] font-bold" style={{ color: '#191919' }}>Aryan Singh</h2>
          <p className="text-[13px] mt-0.5" style={{ color: '#555' }}>Full Stack Software Engineer</p>
          <div className="flex items-center gap-1 mt-1.5 text-[11.5px]" style={{ color: '#666' }}>
            <MapPin size={11} />
            India
          </div>
        </div>

        {/* Connections */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex -space-x-1.5">
            {['#0A66C2', '#057642', '#B24020'].map((c, i) => (
              <div key={i} className="w-5 h-5 rounded-full border-[1.5px] border-white" style={{ background: c }} />
            ))}
          </div>
          <span className="text-[12.5px] font-semibold" style={{ color: '#0A66C2' }}>
            500+ connections
          </span>
        </div>
      </div>

      {/* About */}
      <div className="bg-white mt-2 px-6 py-4 border-b border-black/[0.08]">
        <h3 className="text-[14px] font-semibold mb-2" style={{ color: '#191919' }}>About</h3>
        <p className="text-[13px] leading-relaxed" style={{ color: '#666' }}>
          Passionate Full Stack Engineer building elegant, performant web applications.
          Strong problem solver with a love for clean architecture and great user experiences.
        </p>
      </div>

      {/* Skills */}
      <div className="bg-white mt-2 px-6 py-4 border-b border-black/[0.08]">
        <h3 className="text-[14px] font-semibold mb-3" style={{ color: '#191919' }}>Top Skills</h3>
        <div className="flex flex-wrap gap-2">
          {['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'Docker'].map(skill => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-[12px] font-medium"
              style={{ background: 'rgba(10,102,194,0.08)', color: '#0A66C2', border: '1px solid rgba(10,102,194,0.20)' }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center py-7 bg-white mt-2">
        <OpenButton url={url} label="View on LinkedIn" bg="#0A66C2" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Instagram card
// ─────────────────────────────────────────────────────────────────────────────

const IG_GRADIENT = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';

function InstagramCard() {
  const url = 'https://www.instagram.com/aryaan.uu/';

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-white">

      {/* Gradient header */}
      <div className="h-[72px] flex-shrink-0" style={{ background: IG_GRADIENT }} />

      {/* Profile section */}
      <div className="px-6 -mt-8 pb-5 border-b border-black/[0.08]">
        {/* Avatar with gradient ring */}
        <div
          className="w-[68px] h-[68px] rounded-full p-[2.5px] mb-3 shadow-lg"
          style={{ background: IG_GRADIENT }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-[26px] font-black text-white"
            style={{ background: 'linear-gradient(135deg, #c13584, #833ab4)' }}
          >
            A
          </div>
        </div>

        <h2 className="text-[17px] font-bold" style={{ color: '#0D0D0D' }}>aryaan.uu</h2>
        <p className="text-[13px] mt-0.5" style={{ color: '#737373' }}>Aryan Singh</p>
        <p className="text-[13px] mt-3 leading-relaxed" style={{ color: '#0D0D0D' }}>
          📸 Capturing moments<br />
          💻 CS Student &amp; Builder
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-stretch divide-x divide-black/[0.08] border-b border-black/[0.08]">
        {(['Posts', 'Followers', 'Following'] as const).map(label => (
          <div key={label} className="flex-1 flex flex-col items-center py-4">
            <span className="text-[18px] font-bold" style={{ color: '#0D0D0D' }}>—</span>
            <span className="text-[11px] mt-0.5" style={{ color: '#737373' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="px-6 py-6 text-center flex-1 flex flex-col items-center justify-center gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-1" style={{ background: IG_GRADIENT }}>
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: '#737373' }}>
          Visit Instagram to see the full profile,<br />stories, and posts.
        </p>
      </div>

      {/* CTA */}
      <div className="flex justify-center pb-8">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold shadow-lg active:brightness-90 transition-all duration-150 cursor-default"
          style={{ background: IG_GRADIENT }}
        >
          <ExternalLink size={14} strokeWidth={2.5} />
          View on Instagram
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — routes to the right card by platform ID
// ─────────────────────────────────────────────────────────────────────────────

export function SocialProfile({ platform }: { platform: string }) {
  switch (platform) {
    case 'github':    return <GitHubCard />;
    case 'leetcode':  return <LeetCodeCard />;
    case 'linkedin':  return <LinkedInCard />;
    case 'instagram': return <InstagramCard />;
    default:          return null;
  }
}
