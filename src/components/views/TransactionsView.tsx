/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TransactionFilters } from '../transactions/TransactionFilters';
import { TransactionTable } from '../transactions/TransactionTable';
import { useExpenses } from '../../context/ExpenseContext';
import { Plus, ArrowDownToLine, ReceiptText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Transaction } from '../../types';

interface TransactionsViewProps {
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenAddModal,
  onEditTransaction,
}) => {
  const { transactions, preferences, showToast } = useExpenses();

  // Export to CSV utility (Premium feature requested in future scope but simple and elegant to build!)
  const exportToCSV = () => {
    if (transactions.length === 0) {
      showToast('No transaction data to export', 'warning');
      return;
    }

    const headers = ['ID', 'Title', 'Description', 'Amount', 'Type', 'Category', 'Date', 'Notes'];
    const rows = transactions.map((tx) => [
      tx.id,
      `"${tx.title.replace(/"/g, '""')}"`,
      `"${(tx.description || '').replace(/"/g, '""')}"`,
      tx.amount,
      tx.type,
      `"${tx.category}"`,
      tx.date,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ExpenseFlow_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ledger successfully exported as CSV', 'success');
  };

  return (
    <div className="flex flex-col gap-6 select-none animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-5 select-none">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <ReceiptText className="h-6 w-6 text-blue-500" />
            Operational Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Audit, isolate, filter, and modify cashflows across categories with precision parameters.
          </p>
        </div>

        {/* Header CTA Buttons */}
        <div className="flex items-center gap-2">
          {transactions.length > 0 && (
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="flex items-center gap-1.5 py-2 rounded-xl"
              title="Download ledger spreadsheet"
            >
              <ArrowDownToLine className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          )}

          <Button
            onClick={onOpenAddModal}
            variant="primary"
            className="flex items-center gap-2 py-2 rounded-xl cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Record Entry</span>
          </Button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <TransactionFilters />

      {/* Main Ledger Table */}
      <TransactionTable
        onEdit={onEditTransaction}
        onOpenAddModal={onOpenAddModal}
      />
    </div>
  );
};
