/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Menu, Calendar, User, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onMobileMenuOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuOpen }) => {
  const { preferences, breadcrumbs, setActivePage } = useExpenses();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="bg-white/80 dark:bg-[#080808]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900/40 px-6 h-16 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Breadcrumbs & Mobile Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-[#1f1f1f] rounded-lg transition-all cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 select-none">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-800" />}
                {crumb.page && !isLast ? (
                  <button
                    onClick={() => setActivePage(crumb.page!)}
                    className="hover:text-blue-500 hover:underline transition-colors cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className={isLast ? 'text-slate-800 dark:text-slate-200 font-bold' : ''}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Date and User avatar */}
      <div className="flex items-center gap-4">
        {/* Date */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-slate-900/60 px-3 py-1.5 rounded-xl">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{formattedDate}</span>
        </div>

        {/* User Profile widget */}
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col text-right hidden xs:flex">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {preferences.name || 'Alex Rivera'}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Enterprise Client
            </span>
          </div>

          <div className="h-9 w-9 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm select-none">
            {preferences.name ? preferences.name.split(' ').map((n) => n[0]).join('') : 'AR'}
          </div>
        </div>
      </div>
    </header>
  );
};
