/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  Settings,
  Plus,
  Palette,
  AlertOctagon,
  FolderPlus,
  Trash2,
  Lock,
} from 'lucide-react';
import { getCategoryIcon } from '../transactions/TransactionTable';

export const SettingsView: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    categories,
    addCategory,
    clearTransactions,
  } = useExpenses();

  // Profile Form States
  const [userName, setUserName] = useState(preferences.name || '');
  const [currency, setCurrency] = useState(preferences.currency || '$');
  const [monthlyBudget, setMonthlyBudget] = useState(preferences.monthlyBudget.toString());

  // Category Builder States
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Hexagon');
  const [newCatColor, setNewCatColor] = useState('bg-blue-500/10 text-blue-500');

  // Danger Zone confirmation status
  const [isWipeConfirmed, setIsWipeConfirmed] = useState(false);
  const [wipeConfirmText, setWipeConfirmText] = useState('');

  // Save profile configurations
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    updatePreferences({
      name: userName,
      currency,
      monthlyBudget: Number(monthlyBudget) || 0,
    });
  };

  // Add custom category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    // Separate background and text color class from color string
    const parts = newCatColor.split(' ');
    const bgClass = parts[0] || 'bg-blue-500/10';
    const textClass = parts[1] || 'text-blue-500';

    const success = addCategory({
      name: newCatName.trim(),
      color: bgClass,
      textColor: textClass,
      icon: newCatIcon,
    });

    if (success) {
      setNewCatName('');
    }
  };

  // Execute full wipe
  const handleWipeData = () => {
    if (wipeConfirmText.toUpperCase() === 'DELETE') {
      clearTransactions();
      setIsWipeConfirmed(false);
      setWipeConfirmText('');
    }
  };

  // Pre-configured color options
  const colorOptions = [
    { value: 'bg-blue-500/10 text-blue-500', label: 'Classic Blue' },
    { value: 'bg-rose-500/10 text-rose-500', label: 'Crimson Rose' },
    { value: 'bg-emerald-500/10 text-emerald-500', label: 'Mint Emerald' },
    { value: 'bg-amber-500/10 text-amber-500', label: 'Amber Gold' },
    { value: 'bg-purple-500/10 text-purple-500', label: 'Royal Purple' },
    { value: 'bg-pink-500/10 text-pink-500', label: 'Sassy Pink' },
    { value: 'bg-teal-500/10 text-teal-500', label: 'Sea Teal' },
    { value: 'bg-sky-500/10 text-sky-500', label: 'Sky Blue' },
  ];

  const iconOptions = [
    { value: 'Hexagon', label: 'Hexagon (Default)' },
    { value: 'Utensils', label: 'Food / Utensils' },
    { value: 'Car', label: 'Transport / Car' },
    { value: 'ShoppingBag', label: 'Shopping Bag' },
    { value: 'Receipt', label: 'Receipt / Bill' },
    { value: 'Tv', label: 'Entertainment / TV' },
    { value: 'HeartPulse', label: 'Health / Pulse' },
    { value: 'GraduationCap', label: 'Education / Cap' },
    { value: 'Briefcase', label: 'Salary / Briefcase' },
    { value: 'Laptop', label: 'Freelance / Laptop' },
    { value: 'TrendingUp', label: 'Investments / Trending' },
    { value: 'Building2', label: 'Business / Building' },
    { value: 'PiggyBank', label: 'Savings / Piggy Bank' },
  ];

  const currencyOptions = [
    { value: '$', label: 'USD ($)' },
    { value: '€', label: 'EUR (€)' },
    { value: '£', label: 'GBP (£)' },
    { value: '¥', label: 'JPY (¥)' },
    { value: '₩', label: 'KRW (₩)' },
  ];

  return (
    <div className="flex flex-col gap-6 select-none animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col border-b border-slate-100 dark:border-slate-900 pb-5">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-500" />
          System Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Adjust account preferences, build custom categories, and manage local data structures.
        </p>
      </div>

      {/* Grid: Columns of forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Account Profile & Preferences */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-5">
              Client Profile Settings
            </h2>
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <Input
                label="Full Client Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Alex Rivera"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Local Ledger Currency"
                  options={currencyOptions}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
                <Input
                  label="Target Monthly Budget"
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  placeholder="5000"
                />
              </div>

              <div className="border-t border-slate-50 dark:border-slate-800/40 mt-3 pt-4 flex justify-end">
                <Button type="submit" variant="primary">
                  Apply Preferences
                </Button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-[#131313] border border-rose-500/10 dark:border-rose-950/20 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-black text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertOctagon className="h-5 w-5 animate-pulse" />
              Administrative Danger Zone
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 leading-relaxed font-semibold">
              Wiping your data resets your transaction lists permanently. There is no server backup sync configured yet.
            </p>

            {isWipeConfirmed ? (
              <div className="flex flex-col gap-3.5 bg-rose-500/[0.02] border border-rose-500/10 p-4 rounded-xl animate-fade-in">
                <label className="text-xs font-bold text-rose-800 dark:text-rose-200">
                  Type <span className="underline font-black">DELETE</span> to authorize ledger wipe:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={wipeConfirmText}
                    onChange={(e) => setWipeConfirmText(e.target.value)}
                    placeholder="Type DELETE..."
                    className="flex-1 bg-white dark:bg-[#0a0a0a] border border-rose-500/20 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 uppercase outline-none"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleWipeData}
                    disabled={wipeConfirmText.toUpperCase() !== 'DELETE'}
                  >
                    Authorize Wiping
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsWipeConfirmed(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setIsWipeConfirmed(true)} className="flex items-center gap-1.5 font-bold">
                <Trash2 className="h-4 w-4" />
                Clear Ledger Database
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Custom Category Creator */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <FolderPlus className="h-4 w-4 text-blue-500" />
              Custom Category Builder
            </h2>

            <form onSubmit={handleAddCategory} className="flex flex-col gap-4 mb-6">
              <Input
                label="Category Display Name"
                placeholder="e.g. Subscriptions"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category Icon"
                  options={iconOptions}
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                />
                <Select
                  label="Category Color Accent"
                  options={colorOptions}
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                />
              </div>

              {/* Preview category badge */}
              <div className="bg-slate-50 dark:bg-[#0a0a0a] p-3 rounded-xl border border-slate-100 dark:border-slate-900 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Render Preview:</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${newCatColor}`}>
                  {getCategoryIcon(newCatIcon)}
                  <span>{newCatName || 'Preview Label'}</span>
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="outline" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Build Category</span>
                </Button>
              </div>
            </form>

            {/* List of active categories */}
            <div className="border-t border-slate-50 dark:border-[#1d1d1d] pt-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Current Registered Categories ({categories.length})
              </h3>
              <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <span
                    key={cat.id}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full select-none ${cat.color} ${cat.textColor}`}
                  >
                    {getCategoryIcon(cat.icon)}
                    <span>{cat.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
