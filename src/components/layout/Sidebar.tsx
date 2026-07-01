/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useTheme } from '../../context/ThemeContext';
import { ActivePage } from '../../types';
import {
  LayoutDashboard,
  ArrowUpDown,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage } = useExpenses();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { page: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
    { page: 'transactions' as ActivePage, label: 'Transactions', icon: ArrowUpDown },
    { page: 'reports' as ActivePage, label: 'Reports', icon: TrendingUp },
    { page: 'settings' as ActivePage, label: 'Settings', icon: Settings },
    { page: 'about' as ActivePage, label: 'About', icon: HelpCircle },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-[#0c0c0c] border-r border-slate-100 dark:border-slate-900 h-screen sticky top-0 transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-900/60 h-16 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
                ExpenseFlow
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Smart Finance</span>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1f1f1f] p-1 rounded-lg transition-colors cursor-pointer"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activePage === item.page;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.page}
              onClick={() => setActivePage(item.page)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer ${
                isActive
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#141414] hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <IconComponent className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
              
              {!isCollapsed ? (
                <span>{item.label}</span>
              ) : (
                <span className="absolute left-20 bg-slate-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-md transform translate-x-1 group-hover:translate-x-0 font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}

              {/* Active edge highlight */}
              {isActive && !isCollapsed && (
                <div className="absolute right-0 top-3 bottom-3 w-1 bg-blue-600 dark:bg-blue-400 rounded-l-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Options Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-900/60 shrink-0">
        {isCollapsed ? (
          <div className="flex justify-center py-2 relative group">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#141414] cursor-pointer"
            >
              {resolvedTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <div className="absolute left-20 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-md transform translate-x-1 group-hover:translate-x-0 font-medium whitespace-nowrap">
              Toggle Theme
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-[#111111] p-1.5 rounded-2xl flex items-center justify-between gap-1 border border-slate-100/50 dark:border-slate-900/40">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex justify-center py-2 px-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white dark:bg-[#1c1c1c] text-slate-800 dark:text-slate-200 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Light Mode"
            >
              <Sun className="h-4 w-4 mr-1.5" />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex justify-center py-2 px-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-white dark:bg-[#1c1c1c] text-slate-800 dark:text-slate-200 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Dark Mode"
            >
              <Moon className="h-4 w-4 mr-1.5" />
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex-1 flex justify-center py-2 px-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-white dark:bg-[#1c1c1c] text-slate-800 dark:text-slate-200 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="System Theme"
            >
              <Laptop className="h-4 w-4 mr-1.5" />
              Sys
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
