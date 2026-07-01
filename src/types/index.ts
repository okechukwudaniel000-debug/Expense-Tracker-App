/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind bg-class or hex
  textColor: string; // Tailwind text-class
  icon: string; // Lucide icon name
  isCustom?: boolean;
}

export type Theme = 'light' | 'dark' | 'system';

export type SortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export interface Filters {
  category: string;
  type: 'all' | 'income' | 'expense';
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  search: string;
  sortBy: SortOption;
}

export interface UserPreferences {
  name: string;
  currency: string;
  monthlyBudget: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  undoAction?: () => void;
}

export type ActivePage = 'dashboard' | 'transactions' | 'reports' | 'settings' | 'about';
