/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Search, SlidersHorizontal, RefreshCw, ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/Button';

export const TransactionFilters: React.FC = () => {
  const { filters, setFilters, resetFilters, categories } = useExpenses();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = React.useMemo(() => {
    return (
      filters.category !== 'all' ||
      filters.type !== 'all' ||
      filters.startDate !== '' ||
      filters.endDate !== '' ||
      filters.minAmount !== '' ||
      filters.maxAmount !== '' ||
      filters.search !== ''
    );
  }, [filters]);

  return (
    <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-4 flex flex-col gap-4 shadow-sm select-none">
      {/* Search and Top Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search transactions by title or description..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full bg-slate-50 dark:bg-[#0c0c0c] text-slate-900 dark:text-white border border-slate-100 dark:border-slate-900 rounded-xl pl-11 pr-4 py-2 text-sm transition-all focus:border-blue-500 outline-none font-medium"
          />
        </div>

        <div className="flex gap-2">
          {/* Collapse toggle */}
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden xs:inline">Filters</span>
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            )}
          </Button>

          {/* Reset button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-[#1f1f1f] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              title="Reset all filters"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Expanded filters options */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-50 dark:border-[#1d1d1d] animate-fade-in">
          {/* Category Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="bg-slate-50 dark:bg-[#0c0c0c] text-slate-900 dark:text-white border border-slate-100 dark:border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold outline-none cursor-pointer focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="bg-slate-50 dark:bg-[#0c0c0c] text-slate-900 dark:text-white border border-slate-100 dark:border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold outline-none cursor-pointer focus:border-blue-500"
            >
              <option value="all">Income & Expense</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort Order</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="bg-slate-50 dark:bg-[#0c0c0c] text-slate-900 dark:text-white border border-slate-100 dark:border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold outline-none cursor-pointer focus:border-blue-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>

          {/* Amount thresholds */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount Buffer</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0c0c0c] text-slate-900 dark:text-white border border-slate-100 dark:border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500"
              />
              <span className="text-slate-400 font-extrabold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0c0c0c] text-slate-900 dark:text-white border border-slate-100 dark:border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Date range Filter */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date Window</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0c0c0c] text-slate-900 dark:text-white border border-slate-100 dark:border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500"
              />
              <span className="text-slate-400 font-bold">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0c0c0c] text-slate-900 dark:text-white border border-slate-100 dark:border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
