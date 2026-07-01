/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, ChevronRight, Keyboard, Terminal, Lightbulb, Workflow } from 'lucide-react';

export const AboutView: React.FC = () => {
  const shortcuts = [
    { key: 'N', action: 'Record New Transaction' },
    { key: 'S', action: 'Search / Focus search bar' },
    { key: 'D', action: 'Navigate to Dashboard' },
    { key: 'T', action: 'Navigate to Ledger Table' },
    { key: 'R', action: 'Navigate to Reports Analytics' },
    { key: 'Esc', action: 'Close any active overlay / modal' },
  ];

  const futureScaleInfo = [
    {
      title: 'Database Sync (Firestore / Supabase)',
      desc: 'The global state is managed entirely via the ExpenseContext. Replacing local storage with Cloud Firestore involves writing simple async queries inside the CRUD handlers, keeping the layout screens completely untouched.',
    },
    {
      title: 'User Authentication',
      desc: 'The app is designed with a separate UserPreferences module. Implementing login (Firebase Auth, NextAuth, OAuth) can feed this state dynamically post-validation.',
    },
    {
      title: 'PWA & Offline Pipelines',
      desc: 'Local storage acts as a solid client cache. Swapping the setup with a Service Worker can enable zero-network loads and immediate offline sync queues.',
    },
  ];

  return (
    <div className="flex flex-col gap-6 select-none animate-fade-in max-w-4xl">
      {/* View Header */}
      <div className="flex flex-col border-b border-slate-100 dark:border-slate-900 pb-5">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-blue-500" />
          Technical Blueprint
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Explore ExpenseFlow, an enterprise-grade offline-first personal ledger application.
        </p>
      </div>

      {/* Grid: Description sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Short Description and Stack details */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Terminal className="h-4.5 w-4.5 text-blue-500" />
              Core Technologies
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mb-4">
              Designed as a modern Single Page Application centering strong design patterns, speed, and safety.
            </p>

            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-bold">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-500 shrink-0" />
                <span>React 19 with strict TypeScript definitions</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Tailwind CSS v4 for optimized layout rendering</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Responsive Recharts for financial analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Zod schema validations & React Hook Form</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Robust Context API state architecture</span>
              </li>
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Keyboard className="h-4.5 w-4.5 text-blue-500" />
              Enterprise Key Bindings
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 leading-relaxed font-semibold">
              Accelerate your workflow. These shortcuts work globally inside the workspace.
            </p>

            <div className="flex flex-col gap-2.5">
              {shortcuts.map((shortcut, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">{shortcut.action}</span>
                  <span className="bg-slate-50 dark:bg-[#1c1c1c] border border-slate-150 dark:border-slate-800 px-2.5 py-1 rounded-lg font-mono font-black text-slate-800 dark:text-slate-200">
                    {shortcut.key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Architecture & Future Scalability */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Workflow className="h-4.5 w-4.5 text-blue-500" />
              Future Scalability Matrix
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-5 leading-relaxed font-semibold">
              The application layout files and data states are completely decoupled to allow effortless secondary integrations:
            </p>

            <div className="flex flex-col gap-4">
              {futureScaleInfo.map((info, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/50 dark:bg-[#181818]/30 border border-slate-100 dark:border-slate-800/20 p-4 rounded-xl flex flex-col gap-1.5"
                >
                  <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
                    <Lightbulb className="h-4 w-4 text-blue-500 shrink-0" />
                    {info.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    {info.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
