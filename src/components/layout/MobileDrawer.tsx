/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { ActivePage } from '../../types';
import {
  LayoutDashboard,
  ArrowUpDown,
  TrendingUp,
  Settings,
  HelpCircle,
  X,
  TrendingUp as LogoIcon,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { activePage, setActivePage } = useExpenses();

  // Close drawer if user presses escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = [
    { page: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
    { page: 'transactions' as ActivePage, label: 'Transactions', icon: ArrowUpDown },
    { page: 'reports' as ActivePage, label: 'Reports', icon: TrendingUp },
    { page: 'settings' as ActivePage, label: 'Settings', icon: Settings },
    { page: 'about' as ActivePage, label: 'About', icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0c0c0c] border-r border-slate-100 dark:border-slate-900 flex flex-col z-10 p-5 shadow-2xl transition-all duration-300 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 select-none">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <LogoIcon className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white uppercase">
              ExpenseFlow
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1c1c1c] rounded-lg transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activePage === item.page;
            const Icon = item.icon;

            return (
              <button
                key={item.page}
                onClick={() => {
                  setActivePage(item.page);
                  onClose();
                }}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#141414] hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-slate-900/60 pt-4 text-center select-none">
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
            EXPENSEFLOW SaaS v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};
