/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Transaction } from '../../types';
import { Badge } from '../ui/Badge';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Tv,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  Building2,
  PiggyBank,
  Hexagon,
  Copy,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Inbox,
  FilterX,
  Plus,
} from 'lucide-react';

// Help map category icon name string to Lucide JSX elements
export const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Utensils':
      return <Utensils className="h-4 w-4 shrink-0" />;
    case 'Car':
      return <Car className="h-4 w-4 shrink-0" />;
    case 'ShoppingBag':
      return <ShoppingBag className="h-4 w-4 shrink-0" />;
    case 'Receipt':
      return <Receipt className="h-4 w-4 shrink-0" />;
    case 'Tv':
      return <Tv className="h-4 w-4 shrink-0" />;
    case 'HeartPulse':
      return <HeartPulse className="h-4 w-4 shrink-0" />;
    case 'GraduationCap':
      return <GraduationCap className="h-4 w-4 shrink-0" />;
    case 'Briefcase':
      return <Briefcase className="h-4 w-4 shrink-0" />;
    case 'Laptop':
      return <Laptop className="h-4 w-4 shrink-0" />;
    case 'TrendingUp':
      return <TrendingUp className="h-4 w-4 shrink-0" />;
    case 'Building2':
      return <Building2 className="h-4 w-4 shrink-0" />;
    case 'PiggyBank':
      return <PiggyBank className="h-4 w-4 shrink-0" />;
    default:
      return <Hexagon className="h-4 w-4 shrink-0" />;
  }
};

interface TransactionTableProps {
  onEdit: (tx: Transaction) => void;
  onOpenAddModal: () => void;
  limit?: number; // Optional limit for showing only recent ones on dashboard
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ onEdit, onOpenAddModal, limit }) => {
  const {
    transactions,
    categories,
    preferences,
    filters,
    selectedTxIds,
    toggleSelectTx,
    toggleSelectAll,
    duplicateTransaction,
    deleteTransaction,
    bulkDeleteTransactions,
  } = useExpenses();

  // Pagination parameters
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = limit || 10;

  // Active Row context menu ID track
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.title.toLowerCase().includes(q) ||
          (tx.description && tx.description.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.category !== 'all') {
      result = result.filter((tx) => tx.category === filters.category);
    }

    // Type
    if (filters.type !== 'all') {
      result = result.filter((tx) => tx.type === filters.type);
    }

    // Amount range
    if (filters.minAmount !== '') {
      result = result.filter((tx) => tx.amount >= Number(filters.minAmount));
    }
    if (filters.maxAmount !== '') {
      result = result.filter((tx) => tx.amount <= Number(filters.maxAmount));
    }

    // Date range
    if (filters.startDate) {
      result = result.filter((tx) => tx.date >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter((tx) => tx.date <= filters.endDate);
    }

    // Sort options
    result.sort((a, b) => {
      if (filters.sortBy === 'date_desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (filters.sortBy === 'date_asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (filters.sortBy === 'amount_desc') {
        return b.amount - a.amount;
      }
      if (filters.sortBy === 'amount_asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [transactions, filters]);

  // Compute paginated items
  const paginatedTransactions = useMemo(() => {
    if (limit) {
      return filteredTransactions.slice(0, limit);
    }
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredTransactions.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredTransactions, currentPage, rowsPerPage, limit]);

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleCloseMenus = () => setActiveMenuId(null);
    window.addEventListener('click', handleCloseMenus);
    return () => window.removeEventListener('click', handleCloseMenus);
  }, []);

  const handleToggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const getCategoryMeta = (catName: string) => {
    const match = categories.find((c) => c.name === catName);
    return match || { color: 'bg-slate-500/10', textColor: 'text-slate-500', icon: 'Hexagon' };
  };

  // Check if all row IDs are selected
  const isAllPageSelected = useMemo(() => {
    if (paginatedTransactions.length === 0) return false;
    return paginatedTransactions.every((tx) => selectedTxIds.includes(tx.id));
  }, [paginatedTransactions, selectedTxIds]);

  return (
    <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl overflow-hidden shadow-sm flex flex-col select-none">
      {/* Table Action Header for Selection actions */}
      {selectedTxIds.length > 0 && !limit && (
        <div className="bg-slate-50 dark:bg-[#0c0c0c] border-b border-slate-100 dark:border-slate-900 px-6 py-3.5 flex items-center justify-between animate-fade-in">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {selectedTxIds.length} item(s) selected for operations
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={bulkDeleteTransactions}
            className="flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Main Table view wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 dark:border-slate-900 bg-slate-50/40 dark:bg-[#0d0d0d]/40">
              {!limit && (
                <th className="px-6 py-4 w-10">
                  <Checkbox
                    checked={isAllPageSelected}
                    onChange={() => toggleSelectAll(paginatedTransactions.map((t) => t.id))}
                  />
                </th>
              )}
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Title & Details
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-16">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => {
                const catMeta = getCategoryMeta(tx.category);
                const isSelected = selectedTxIds.includes(tx.id);
                
                return (
                  <tr
                    key={tx.id}
                    className={`hover:bg-slate-50/50 dark:hover:bg-[#151515]/50 transition-all ${
                      isSelected ? 'bg-blue-500/[0.01] dark:bg-blue-500/[0.02]' : ''
                    }`}
                  >
                    {!limit && (
                      <td className="px-6 py-3.5">
                        <Checkbox checked={isSelected} onChange={() => toggleSelectTx(tx.id)} />
                      </td>
                    )}
                    <td className="px-6 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs">
                          {tx.title}
                        </span>
                        {tx.description && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                            {tx.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="custom" colorClass={catMeta.color} textColorClass={catMeta.textColor}>
                        {getCategoryIcon(catMeta.icon)}
                        <span>{tx.category}</span>
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      {tx.type === 'income' ? (
                        <Badge variant="success">INFLOW</Badge>
                      ) : (
                        <Badge variant="danger">OUTFLOW</Badge>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-right font-black text-sm">
                      <span className={tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'}>
                        {tx.type === 'income' ? '+' : '-'}
                        {preferences.currency}
                        {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center relative">
                      <button
                        onClick={(e) => handleToggleMenu(e, tx.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all cursor-pointer"
                        aria-label="More actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown options */}
                      {activeMenuId === tx.id && (
                        <div className="absolute right-6 top-11 bg-white dark:bg-[#181818] border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl py-1.5 z-40 min-w-[130px] animate-fade-in">
                          <button
                            onClick={() => onEdit(tx)}
                            className="w-full text-left px-3.5 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#202020] text-slate-600 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit details
                          </button>
                          <button
                            onClick={() => duplicateTransaction(tx.id)}
                            className="w-full text-left px-3.5 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#202020] text-slate-600 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Duplicate
                          </button>
                          <div className="border-t border-slate-50 dark:border-[#222] my-1" />
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="w-full text-left px-3.5 py-2 text-xs font-bold hover:bg-rose-500/10 text-rose-500 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={limit ? 6 : 7} className="text-center py-16 px-6">
                  {transactions.length === 0 ? (
                    // Global empty state
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto select-none">
                      <div className="bg-slate-50 dark:bg-[#191919]/50 text-slate-300 dark:text-slate-700 p-5 rounded-3xl mb-4 border border-dashed border-slate-200 dark:border-slate-800">
                        <Inbox className="h-9 w-9" />
                      </div>
                      <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                        No transactions registered
                      </h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
                        Your cash accounts have zero transactions listed. Tap below to add your first income or expense item.
                      </p>
                      <Button onClick={onOpenAddModal} variant="primary" className="mt-5 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Income or Expense
                      </Button>
                    </div>
                  ) : (
                    // Filters empty state
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto select-none">
                      <div className="bg-amber-500/10 text-amber-500 p-5 rounded-3xl mb-4 border border-dashed border-amber-500/10">
                        <FilterX className="h-9 w-9" />
                      </div>
                      <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                        Zero search match items
                      </h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
                        Adjust categories, text query keywords, or the amount buffers to locate target line entries.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!limit && totalPages > 1 && (
        <div className="border-t border-slate-50 dark:border-slate-900 bg-slate-50/20 dark:bg-[#0d0d0d]/10 px-6 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">
            Page {currentPage} of {totalPages} ({filteredTransactions.length} items)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="p-1 px-2.5 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="p-1 px-2.5 flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
