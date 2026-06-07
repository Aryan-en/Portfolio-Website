"use client";

import { useState } from 'react';
import {
  Inbox, Flag, FileText, Send, Star, Trash2, Archive, Mail,
  Filter, MoreHorizontal, Pencil, ChevronLeft, ChevronRight,
  ShoppingCart, MessageSquare, Bell, Search, Reply, AlertCircle,
  FolderOpen, Users, CornerUpLeft, CornerUpRight, Folder,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types & data
// ─────────────────────────────────────────────────────────────────────────────

type TabId = 'primary' | 'promotions' | 'social' | 'updates';

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  unread: boolean;
  flagged?: boolean;
  tab: TabId;
}

const EMAILS: Email[] = [
  {
    id: '1', from: 'Hugging Face', fromEmail: 'noreply@huggingface.co',
    subject: 'New login to your Hugging Face account',
    preview: 'We noticed a new sign-in to your account from a new device.',
    body: `Hi Aryan,

We noticed a new sign-in to your Hugging Face account.

Device: Chrome on macOS
Location: Chandigarh, India
Time: 16 May 2026, 2:34 PM IST

If this was you, no action is needed. If you don't recognise this activity, reset your password immediately.

Stay safe,
The Hugging Face Team`,
    date: '16/05/26', unread: true, tab: 'primary',
  },
  {
    id: '2', from: 'Hugging Face', fromEmail: 'noreply@huggingface.co',
    subject: '[Hugging Face] Password reset',
    preview: 'Someone requested a password reset for your account.',
    body: `Hi Aryan,

We received a request to reset the password for the Hugging Face account associated with this email.

Click the link below to reset your password. This link expires in 24 hours.

If you did not request a password reset, ignore this email — your password will not change.

The Hugging Face Team`,
    date: '16/05/26', unread: true, tab: 'primary',
  },
  {
    id: '3', from: 'Reddit', fromEmail: 'noreply@reddit.com',
    subject: '"Ed grades"',
    preview: 'r/PECChd: Ed grades End sem went shit 55-60 (overall marks) ke around kitna grade banega And agr end sem difficult tha toh b+...',
    body: `Reddit notification

r/PECChd

"Ed grades"

u/anonymous123 posted:

Ed grades End sem went shit 55-60 (overall marks) ke around kitna grade banega? And agr end sem difficult tha toh b+ milega ya nahi? Koi bata sakta hai rough idea?

Top comment: Depends on the bell curve bhai. Usually 55+ gets B if the exam was hard.

View this post on Reddit`,
    date: '15/05/26', unread: true, tab: 'primary',
  },
  {
    id: '4', from: 'Google Maps', fromEmail: 'maps-noreply@google.com',
    subject: 'Google Maps Policy Reminder',
    preview: "Here's what you need to know. Hello Aryan, This is a reminder that contributions to Google Maps must follow our policies. · O...",
    body: `Hello Aryan,

This is a reminder that contributions to Google Maps must follow our policies.

Our community guidelines help keep Google Maps accurate and useful for everyone. Contributions that violate our policies — including fake reviews, spam, or inappropriate content — may be removed.

Thank you for contributing to Google Maps.

The Google Maps Team`,
    date: '15/05/26', unread: true, tab: 'primary',
  },
  {
    id: '5', from: 'noreply@codeforces.com', fromEmail: 'noreply@codeforces.com',
    subject: 'Codeforces - New login',
    preview: 'Hello, Aryan_1142. You received this letter because someone logged into your account from: ip: 49.156.73.101 browser: Chro...',
    body: `Hello, Aryan_1142.

You received this letter because someone logged into your Codeforces account.

IP: 49.156.73.101
Browser: Chrome 124
Location: Chandigarh, IN
Time: 15 May 2026 10:22 UTC

If it was you, ignore this message. Otherwise, change your password immediately.

Codeforces`,
    date: '15/05/26', unread: true, tab: 'primary',
  },
  {
    id: '6', from: 'GirlScript Foundation', fromEmail: 'no-reply@girlscript.tech',
    subject: 'Login To Your Smartly Labs Account – Your OTP Inside',
    preview: 'SMARTLY Labs · Auth Authentication Your login code Use the code below to sign in to Smartly Labs Products. It expires in 10...',
    body: `SMARTLY Labs — Authentication

Your login code

Use the code below to sign in to Smartly Labs Products. It expires in 10 minutes.

  ┌──────────────┐
  │   847 293    │
  └──────────────┘

Don't share this code with anyone.

GirlScript Foundation`,
    date: '15/05/26', unread: true, tab: 'primary',
  },
  {
    id: '7', from: 'The Neo4j Team', fromEmail: 'neo4j@neo4j.com',
    subject: 'Real data, real code: GraphRAG demo',
    preview: 'Watch this demo. How GraphRAG Works: A Real-World Example. Hey there, Want to see GraphRAG in action? Trad...',
    body: `Hey Aryan,

Want to see GraphRAG in action?

Traditional RAG struggles with complex, multi-hop questions. GraphRAG solves this by combining knowledge graphs with large language models — giving you more accurate, explainable answers.

Watch our live demo: How to build a GraphRAG pipeline with Neo4j + LangChain in under 30 minutes.

Watch the demo →

Happy graphing,
The Neo4j Team`,
    date: '15/05/26', unread: false, tab: 'primary',
  },
  {
    id: '8', from: 'GitHub', fromEmail: 'noreply@github.com',
    subject: '[GitHub] Security alert: new SSH key added',
    preview: 'A new SSH key was added to your GitHub account. If you added this key, no further action is needed.',
    body: `Hi @Aryan-en,

A new SSH key was added to your account.

Key name: MacBook Air
Fingerprint: SHA256:xK9mP2...

If you added this key, you can ignore this message. If you did not add this key, remove it immediately and contact GitHub Support.

GitHub Security`,
    date: '14/05/26', unread: false, tab: 'primary',
  },
  {
    id: '9', from: 'LeetCode', fromEmail: 'no-reply@leetcode.com',
    subject: 'Your weekly LeetCode progress',
    preview: 'Keep the streak going! You solved 7 problems this week. Your current rating: 1842. Top 15% globally.',
    body: `Hi Aryan,

Here's your weekly summary:

✅ Problems solved this week: 7
🔥 Current streak: 23 days
⭐ Rating: 1842 (Top 15%)

Problems solved:
• Two Sum II — Easy
• Valid Parentheses — Easy
• Merge Intervals — Medium
• Longest Substring Without Repeating Characters — Medium
• Binary Tree Level Order Traversal — Medium
• Word Search — Medium
• Trapping Rain Water — Hard

Keep it up!
LeetCode`,
    date: '14/05/26', unread: false, tab: 'promotions',
  },
  {
    id: '10', from: 'LinkedIn', fromEmail: 'messages-noreply@linkedin.com',
    subject: 'You appeared in 12 searches this week',
    preview: 'Recruiters and professionals are looking at your profile. See who searched for you.',
    body: `Hi Aryan,

Your profile appeared in 12 searches this week.

Top search keywords:
• "software engineer"
• "machine learning engineer"
• "next.js developer"

Companies that viewed your profile include tech companies in Bangalore, Delhi NCR, and remote positions.

View your profile analytics →

LinkedIn`,
    date: '13/05/26', unread: false, tab: 'updates',
  },
  {
    id: '11', from: 'Vercel', fromEmail: 'noreply@vercel.com',
    subject: 'Your deployment was successful',
    preview: 'Portfolio Website · Production deployment ready. View at aryan-portfolio.vercel.app',
    body: `Deployment Successful 🎉

Project: Portfolio Website
Branch: main
Commit: f2bee16 — Refactor code structure

Your deployment is live at:
https://aryan-portfolio.vercel.app

Build summary:
• Build time: 23s
• Functions: 0
• Static files: 42

Vercel`,
    date: '13/05/26', unread: false, tab: 'updates',
  },
  {
    id: '12', from: 'Google', fromEmail: 'no-reply@accounts.google.com',
    subject: 'New sign-in to your Google Account',
    preview: 'Your Google Account aryan.en.1142@gmail.com was just signed in from a new Mac device.',
    body: `aryan.en.1142@gmail.com

New sign-in

Your Google Account was just signed in from a new device.

Device: MacBook Air
Location: Chandigarh, India
Time: 12 May 2026

If this was you, you don't need to do anything. If not, we'll help you secure your account.

Google`,
    date: '12/05/26', unread: false, tab: 'primary',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar data
// ─────────────────────────────────────────────────────────────────────────────

interface MailboxItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

const SIDEBAR: { section: string; items: MailboxItem[] }[] = [
  {
    section: 'Favourites',
    items: [
      { id: 'fav-inbox',   label: 'Inbox',   icon: <Inbox size={14} />,    count: 410 },
      { id: 'fav-flagged', label: 'Flagged', icon: <Flag size={14} />,     count: 1   },
      { id: 'fav-drafts',  label: 'Drafts',  icon: <FileText size={14} />, count: 5   },
      { id: 'fav-sent',    label: 'Sent',    icon: <Send size={14} />               },
    ],
  },
  {
    section: 'Smart Mailboxes',
    items: [],
  },
  {
    section: 'Google',
    items: [
      { id: 'goog-important', label: 'Important', icon: <Star size={14} />,    count: 114  },
      { id: 'goog-inbox',     label: 'Inbox',     icon: <Inbox size={14} />,   count: 410  },
      { id: 'goog-drafts',    label: 'Drafts',    icon: <FileText size={14} />,count: 5    },
      { id: 'goog-sent',      label: 'Sent',      icon: <Send size={14} />                 },
      { id: 'goog-junk',      label: 'Junk',      icon: <AlertCircle size={14} />, count: 26 },
      { id: 'goog-bin',       label: 'Bin',       icon: <Trash2 size={14} />               },
      { id: 'goog-archive',   label: 'Archive',   icon: <Archive size={14} />, count: 8718 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────────────────────────────────

const TABS: { id: TabId; icon: React.ReactNode }[] = [
  { id: 'primary',    icon: <Users size={13} strokeWidth={2} /> },
  { id: 'promotions', icon: <ShoppingCart size={13} strokeWidth={2} /> },
  { id: 'social',     icon: <MessageSquare size={13} strokeWidth={2} /> },
  { id: 'updates',    icon: <Bell size={13} strokeWidth={2} /> },
];

// ─────────────────────────────────────────────────────────────────────────────
// Avatar initial from sender name
// ─────────────────────────────────────────────────────────────────────────────

const SENDER_COLORS: Record<string, string> = {
  'Hugging Face': '#FF9500',
  'Reddit': '#FF4500',
  'Google Maps': '#34A853',
  'noreply@codeforces.com': '#1F8EFA',
  'GirlScript Foundation': '#EE4B9E',
  'The Neo4j Team': '#008CC1',
  'GitHub': '#171515',
  'LeetCode': '#FFA116',
  'LinkedIn': '#0A66C2',
  'Vercel': '#000000',
  'Google': '#4285F4',
};

function senderColor(from: string) {
  return SENDER_COLORS[from] ?? '#636366';
}

function senderInitials(from: string) {
  const words = from.split(/[\s@.]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return from.slice(0, 2).toUpperCase();
}

function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ─────────────────────────────────────────────────────────────────────────────
// Mail App
// ─────────────────────────────────────────────────────────────────────────────

const BG_SIDEBAR  = '#252527';
const BG_LIST     = '#1E1E20';
const BG_DETAIL   = '#1C1C1E';
const BORDER      = 'rgba(255,255,255,0.07)';
const BLUE        = '#0A84FF';

export function MailApp() {
  const [selectedMailbox, setSelectedMailbox]   = useState('fav-inbox');
  const [activeTab, setActiveTab]               = useState<TabId>('primary');
  const [selectedEmail, setSelectedEmail]        = useState<Email | null>(null);
  const [readIds, setReadIds]                   = useState<Set<string>>(new Set());

  const visibleEmails = EMAILS.filter(e => e.tab === activeTab);
  const unreadCount   = EMAILS.filter(e => e.unread && !readIds.has(e.id) && e.tab === 'primary').length;

  const openEmail = (email: Email) => {
    setSelectedEmail(email);
    setReadIds(prev => new Set([...prev, email.id]));
  };

  const isUnread = (e: Email) => e.unread && !readIds.has(e.id);

  return (
    <div className="flex flex-col w-full h-full" style={{ background: BG_DETAIL }}>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-3 flex-shrink-0"
        style={{ height: 44, borderBottom: `0.5px solid ${BORDER}`, background: BG_SIDEBAR }}
      >
        {/* Left group */}
        <div className="flex items-center gap-1">
          <ToolBtn aria-label="Filter"><Filter size={14} strokeWidth={1.8} /></ToolBtn>
          <ToolBtn aria-label="More"><MoreHorizontal size={15} strokeWidth={1.8} /></ToolBtn>
          <div style={{ width: 1, height: 18, background: BORDER, margin: '0 4px' }} />
          <ToolBtn aria-label="Compose">
            <Pencil size={14} strokeWidth={1.8} />
          </ToolBtn>
        </div>

        {/* Right group */}
        <div className="flex items-center gap-1">
          <ToolBtn aria-label="Back"><ChevronLeft size={15} strokeWidth={1.8} /></ToolBtn>
          <ToolBtn aria-label="Forward"><ChevronRight size={15} strokeWidth={1.8} /></ToolBtn>
          <div style={{ width: 1, height: 18, background: BORDER, margin: '0 4px' }} />
          <ToolBtn aria-label="Reply" disabled={!selectedEmail}><Reply size={14} strokeWidth={1.8} /></ToolBtn>
          <ToolBtn aria-label="Reply All" disabled={!selectedEmail}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
              <path d="M5 4L1 7l4 3M3 7h8a3 3 0 010 6H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 4L5.5 7 9 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ToolBtn>
          <ToolBtn aria-label="Forward mail" disabled={!selectedEmail}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 4l4 3-4 3M11 7H3a3 3 0 000 6h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ToolBtn>
          <div style={{ width: 1, height: 18, background: BORDER, margin: '0 4px' }} />
          <ToolBtn aria-label="Archive" disabled={!selectedEmail}><Archive size={14} strokeWidth={1.8} /></ToolBtn>
          <ToolBtn aria-label="Delete" disabled={!selectedEmail}><Trash2 size={14} strokeWidth={1.8} /></ToolBtn>
          <ToolBtn aria-label="Junk" disabled={!selectedEmail}><AlertCircle size={14} strokeWidth={1.8} /></ToolBtn>
          <ToolBtn aria-label="Move" disabled={!selectedEmail}><FolderOpen size={14} strokeWidth={1.8} /></ToolBtn>
          <div style={{ width: 1, height: 18, background: BORDER, margin: '0 4px' }} />
          <ToolBtn aria-label="Flag" disabled={!selectedEmail}><Flag size={14} strokeWidth={1.8} /></ToolBtn>
          <div style={{ width: 1, height: 18, background: BORDER, margin: '0 4px' }} />
          <ToolBtn aria-label="Search"><Search size={14} strokeWidth={1.8} /></ToolBtn>
        </div>
      </div>

      {/* ── Three panels ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <div
          className="flex flex-col flex-shrink-0 overflow-y-auto"
          style={{ width: 190, background: BG_SIDEBAR, borderRight: `0.5px solid ${BORDER}` }}
        >
          <div className="pt-3 pb-4 flex-1">
            {SIDEBAR.map(({ section, items }) => (
              <div key={section}>
                <p className="px-3 pt-2 pb-0.5 text-[11px] font-semibold text-white/35 tracking-[0.04em]">
                  {section}
                </p>
                {items.map(item => {
                  const sel = selectedMailbox === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedMailbox(item.id)}
                      className="w-full flex items-center gap-2 px-3 py-[5px] rounded-[7px] mx-[4px] cursor-default transition-none"
                      style={{
                        width: 'calc(100% - 8px)',
                        background: sel ? BLUE : 'transparent',
                      }}
                    >
                      <span style={{ color: sel ? 'white' : 'rgba(255,255,255,0.55)', display: 'flex' }}>
                        {item.icon}
                      </span>
                      <span
                        className="flex-1 text-left text-[13px] font-[450] truncate"
                        style={{ color: sel ? 'white' : 'rgba(255,255,255,0.85)' }}
                      >
                        {item.label}
                      </span>
                      {item.count != null && (
                        <span
                          className="text-[11px] font-medium flex-shrink-0 tabular-nums"
                          style={{ color: sel ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.35)' }}
                        >
                          {formatCount(item.count)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Download progress bar */}
          <div className="px-4 pb-3 pt-2" style={{ borderTop: `0.5px solid ${BORDER}` }}>
            <div className="h-[3px] rounded-full bg-white/10 mb-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-[#0A84FF]" style={{ width: '18%' }} />
            </div>
            <p className="text-[10px] text-white/35 font-medium">Downloading Messages</p>
            <p className="text-[10px] text-white/25">31 new messages</p>
          </div>
        </div>

        {/* ── Email list ───────────────────────────────────────────────────── */}
        <div
          className="flex flex-col flex-shrink-0"
          style={{ width: 288, background: BG_LIST, borderRight: `0.5px solid ${BORDER}` }}
        >
          {/* Inbox header */}
          <div className="px-4 pt-3 pb-0 flex-shrink-0">
            <p className="text-white font-semibold text-[18px] leading-tight">Inbox</p>
            <p className="text-[11px] mt-[1px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Primary · 553 messages, {unreadCount} unread
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0">
            {TABS.map(tab => {
              const isSel = tab.id === activeTab;
              if (tab.id === 'primary') {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-1.5 px-3 py-[5px] rounded-full text-[12px] font-medium cursor-default flex-shrink-0"
                    style={{ background: isSel ? BLUE : 'rgba(255,255,255,0.10)', color: 'white' }}
                  >
                    {tab.icon}
                    <span>Primary</span>
                  </button>
                );
              }
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center justify-center w-[30px] h-[30px] rounded-full cursor-default flex-shrink-0"
                  style={{ background: isSel ? BLUE : 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.65)' }}
                >
                  {tab.icon}
                </button>
              );
            })}
            {/* Overflow dot */}
            <button
              className="flex items-center justify-center w-[30px] h-[30px] rounded-full cursor-default flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.40)' }}
            >
              <span className="text-[16px] leading-none" style={{ letterSpacing: '-2px', marginLeft: -2 }}>···</span>
            </button>
          </div>

          {/* Email rows */}
          <div className="flex-1 overflow-y-auto">
            {visibleEmails.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-white/25 text-[13px]">No messages</p>
              </div>
            )}
            {visibleEmails.map((email, idx) => {
              const isSel    = selectedEmail?.id === email.id;
              const unread   = isUnread(email);
              return (
                <div key={email.id}>
                  <button
                    onClick={() => openEmail(email)}
                    className="w-full text-left px-4 py-[10px] cursor-default"
                    style={{ background: isSel ? 'rgba(10,132,255,0.18)' : 'transparent' }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Unread dot */}
                      <div className="flex-shrink-0 mt-[5px]" style={{ width: 8 }}>
                        {unread && (
                          <div className="w-2 h-2 rounded-full" style={{ background: BLUE }} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Row 1: sender + date */}
                        <div className="flex items-baseline justify-between gap-1">
                          <p
                            className="truncate text-[13px] leading-tight"
                            style={{ fontWeight: unread ? 600 : 400, color: 'rgba(255,255,255,0.90)' }}
                          >
                            {email.from}
                          </p>
                          <p className="flex-shrink-0 text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {email.date}
                          </p>
                        </div>

                        {/* Row 2: subject */}
                        <p
                          className="truncate text-[12px] leading-snug mt-[1px]"
                          style={{ color: 'rgba(255,255,255,0.70)' }}
                        >
                          {email.subject}
                        </p>

                        {/* Row 3: preview */}
                        <div className="flex items-end justify-between gap-1 mt-[2px]">
                          <p
                            className="text-[11px] leading-[1.35] flex-1 min-w-0"
                            style={{
                              color: 'rgba(255,255,255,0.32)',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            } as React.CSSProperties}
                          >
                            {email.preview}
                          </p>
                          {/* Email chat icon */}
                          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" className="flex-shrink-0 mb-0.5 opacity-30">
                            <rect x="0.5" y="0.5" width="13" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                            <path d="M3 11l2-2h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3.5 3.5h7M3.5 6h5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Separator */}
                  {idx < visibleEmails.length - 1 && (
                    <div style={{ height: '0.5px', background: BORDER, marginLeft: 40 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Detail panel ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col" style={{ background: BG_DETAIL }}>
          {selectedEmail ? (
            <EmailDetail email={selectedEmail} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[20px] font-light" style={{ color: 'rgba(255,255,255,0.18)' }}>
                No Message Selected
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Email detail view
// ─────────────────────────────────────────────────────────────────────────────

function EmailDetail({ email }: { email: Email }) {
  const initials = senderInitials(email.from);
  const color    = senderColor(email.from);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex-shrink-0" style={{ borderBottom: `0.5px solid rgba(255,255,255,0.07)` }}>
        <p className="text-white font-semibold text-[18px] leading-tight">{email.subject}</p>

        <div className="flex items-center gap-2.5 mt-3">
          {/* Sender avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[13px] font-semibold"
            style={{ background: color }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <p className="text-white text-[13px] font-medium">{email.from}</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                &lt;{email.fromEmail}&gt;
              </p>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              To: aryan.en.1142@gmail.com · {email.date}
            </p>
          </div>
          <p className="flex-shrink-0 text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {email.date.replace(/(\d+)\/(\d+)\/(\d+)/, '20$3-$2-$1')}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <pre
          className="text-[13px] leading-[1.65] whitespace-pre-wrap font-[system-ui,sans-serif]"
          style={{ color: 'rgba(255,255,255,0.80)', fontFamily: 'inherit' }}
        >
          {email.body}
        </pre>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar button
// ─────────────────────────────────────────────────────────────────────────────

function ToolBtn({ children, 'aria-label': label, disabled }: {
  children: React.ReactNode;
  'aria-label': string;
  disabled?: boolean;
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      className="flex items-center justify-center w-[28px] h-[28px] rounded-[6px] cursor-default transition-colors"
      style={{
        color: disabled ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.65)',
        background: 'transparent',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}
