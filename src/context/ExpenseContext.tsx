/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Transaction, Category, UserPreferences, Filters, Toast, ActivePage, SortOption } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_PREFERENCES, SEED_TRANSACTIONS } from '../constants';

interface ExpenseContextType {
  transactions: Transaction[];
  categories: Category[];
  preferences: UserPreferences;
  activePage: ActivePage;
  filters: Filters;
  selectedTxIds: string[];
  toasts: Toast[];
  
  // Transactions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string, skipToast?: boolean) => void;
  duplicateTransaction: (id: string) => void;
  bulkDeleteTransactions: () => void;
  clearTransactions: () => void;
  
  // Categories
  addCategory: (cat: Omit<Category, 'id' | 'isCustom'>) => boolean;
  
  // Preferences
  updatePreferences: (pref: UserPreferences) => void;
  
  // Page Navigation
  setActivePage: (page: ActivePage) => void;
  breadcrumbs: { label: string; page?: ActivePage }[];
  
  // Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resetFilters: () => void;
  
  // Selection
  setSelectedTxIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelectTx: (id: string) => void;
  toggleSelectAll: (ids: string[]) => void;
  
  // Toast notifications
  showToast: (message: string, type: Toast['type'], undoAction?: () => void) => void;
  removeToast: (id: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const initialFilters: Filters = {
  category: 'all',
  type: 'all',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  search: '',
  sortBy: 'date_desc',
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core LocalStorage Persistence
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('expenseflow-transactions', SEED_TRANSACTIONS);
  const [categories, setCategories] = useLocalStorage<Category[]>('expenseflow-categories', DEFAULT_CATEGORIES);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('expenseflow-preferences', DEFAULT_PREFERENCES);
  const [filters, setFilters] = useLocalStorage<Filters>('expenseflow-filters', initialFilters);
  
  // UI States
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Ref for holding recently deleted items for UNDO
  const lastDeletedTxRef = useRef<Transaction | null>(null);

  // Toast controls
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'], undoAction?: () => void) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, undoAction }]);
    
    // Auto remove after 5s unless it's a success with undo (give user time)
    const timeout = type === 'success' && undoAction ? 6000 : 4000;
    setTimeout(() => {
      removeToast(id);
    }, timeout);
  }, [removeToast]);

  // Transactions management
  const addTransaction = useCallback((txData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Transaction "${newTx.title}" added successfully`, 'success');
  }, [setTransactions, showToast]);

  const updateTransaction = useCallback((updatedTx: Transaction) => {
    const now = new Date().toISOString();
    const withUpdatedTime = {
      ...updatedTx,
      updatedAt: now,
    };
    
    setTransactions((prev) => prev.map((tx) => (tx.id === updatedTx.id ? withUpdatedTime : tx)));
    showToast(`Transaction updated successfully`, 'success');
  }, [setTransactions, showToast]);

  const deleteTransaction = useCallback((id: string, skipToast = false) => {
    const targetTx = transactions.find((tx) => tx.id === id);
    if (!targetTx) return;
    
    // Store in ref for possible undo
    lastDeletedTxRef.current = targetTx;
    
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    setSelectedTxIds((prev) => prev.filter((txId) => txId !== id));

    if (!skipToast) {
      // Create undo callback
      const handleUndo = () => {
        if (lastDeletedTxRef.current) {
          const restored = lastDeletedTxRef.current;
          setTransactions((prev) => {
            // Check if already exists to prevent duplicate undo trigger
            if (prev.some(t => t.id === restored.id)) return prev;
            // Insert back, sorting by date or just prepending
            return [restored, ...prev];
          });
          lastDeletedTxRef.current = null;
          showToast(`Restored "${restored.title}"`, 'info');
        }
      };
      
      showToast(`Deleted "${targetTx.title}"`, 'success', handleUndo);
    }
  }, [transactions, setTransactions, showToast]);

  const duplicateTransaction = useCallback((id: string) => {
    const targetTx = transactions.find((tx) => tx.id === id);
    if (!targetTx) return;
    
    const now = new Date().toISOString();
    const duplicated: Transaction = {
      ...targetTx,
      id: `tx-${Math.random().toString(36).substring(2, 9)}`,
      title: `${targetTx.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    
    setTransactions((prev) => [duplicated, ...prev]);
    showToast(`Duplicated "${targetTx.title}"`, 'success');
  }, [transactions, setTransactions, showToast]);

  const bulkDeleteTransactions = useCallback(() => {
    if (selectedTxIds.length === 0) return;
    
    const count = selectedTxIds.length;
    const itemsToDelete = transactions.filter((tx) => selectedTxIds.includes(tx.id));
    
    setTransactions((prev) => prev.filter((tx) => !selectedTxIds.includes(tx.id)));
    setSelectedTxIds([]);
    
    // Support bulk undo
    const handleBulkUndo = () => {
      setTransactions((prev) => {
        const uniqueItems = itemsToDelete.filter(item => !prev.some(p => p.id === item.id));
        return [...uniqueItems, ...prev];
      });
      showToast(`Restored ${count} transactions`, 'info');
    };

    showToast(`Bulk deleted ${count} transaction(s)`, 'success', handleBulkUndo);
  }, [selectedTxIds, transactions, setTransactions, showToast]);

  const clearTransactions = useCallback(() => {
    setTransactions([]);
    setSelectedTxIds([]);
    showToast('All transactions cleared', 'warning');
  }, [setTransactions, showToast]);

  // Categories management
  const addCategory = useCallback((catData: Omit<Category, 'id' | 'isCustom'>): boolean => {
    // Check if name already exists (case insensitive)
    const exists = categories.some((c) => c.name.toLowerCase() === catData.name.toLowerCase());
    if (exists) {
      showToast(`Category "${catData.name}" already exists`, 'error');
      return false;
    }
    
    const newCat: Category = {
      ...catData,
      id: `cat-${Math.random().toString(36).substring(2, 9)}`,
      isCustom: true,
    };
    
    setCategories((prev) => [...prev, newCat]);
    showToast(`Custom category "${newCat.name}" created`, 'success');
    return true;
  }, [categories, setCategories, showToast]);

  // Preferences
  const updatePreferences = useCallback((newPref: UserPreferences) => {
    setPreferences(newPref);
    showToast('Preferences updated successfully', 'success');
  }, [setPreferences, showToast]);

  // Filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    showToast('Filters reset', 'info');
  }, [setFilters, showToast]);

  // Transaction selection
  const toggleSelectTx = useCallback((id: string) => {
    setSelectedTxIds((prev) =>
      prev.includes(id) ? prev.filter((txId) => txId !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSelectedTxIds((prev) => {
      const allSelected = ids.every((id) => prev.includes(id));
      if (allSelected) {
        // Unselect these IDs
        return prev.filter((id) => !ids.includes(id));
      } else {
        // Select all of these IDs (avoiding duplicates)
        const newSelection = [...prev];
        ids.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      }
    });
  }, []);

  // Compute navigation breadcrumbs
  const breadcrumbs = useMemo(() => {
    const list: { label: string; page?: ActivePage }[] = [{ label: 'ExpenseFlow', page: 'dashboard' as ActivePage }];
    if (activePage === 'dashboard') {
      list.push({ label: 'Overview' });
    } else {
      list.push({
        label: activePage.charAt(0).toUpperCase() + activePage.slice(1),
        page: activePage,
      });
    }
    return list;
  }, [activePage]);

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        categories,
        preferences,
        activePage,
        filters,
        selectedTxIds,
        toasts,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        duplicateTransaction,
        bulkDeleteTransactions,
        clearTransactions,
        addCategory,
        updatePreferences,
        setActivePage,
        breadcrumbs,
        setFilters,
        resetFilters,
        setSelectedTxIds,
        toggleSelectTx,
        toggleSelectAll,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
