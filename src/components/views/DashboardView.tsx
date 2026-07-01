/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { StatCards } from '../dashboard/StatCards';
import { FinancialHealth } from '../dashboard/FinancialHealth';
import { SpendingAlerts } from '../dashboard/SpendingAlerts';
import { TransactionTable } from '../transactions/TransactionTable';
import { Plus, ArrowRight, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Transaction } from '../../types';

interface DashboardViewProps {
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAddModal, onEditTransaction }) => {
  const { preferences, setActivePage, transactions } = useExpenses();

  // Determine welcome greeting based on hour
  const greeting = React.useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Quick stats calculations for welcome banner
  const netEarnings = React.useMemo(() => {
    let earned = 0;
    let spent = 0;
    transactions.forEach((t) => {
      if (t.type === 'income') earned += t.amount;
      else spent += t.amount;
    });
    return earned - spent;
  }, [transactions]);

  return (
    <div className="flex flex-col gap-6 select-none animate-fade-in">
      {/* Top Banner: Welcome Header */}
      <div className="bg-slate-900 dark:bg-[#131313] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-800/20 shadow-xl shadow-blue-500/[0.01]">
        {/* Subtle grid accent background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        
        <div className="flex flex-col gap-1 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
            {greeting}, {preferences.name || 'Alex Rivera'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Welcome back to ExpenseFlow. Here is your current enterprise-grade liquidity evaluation.
          </p>
        </div>

        {/* Quick statistics tag or add action */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="hidden xs:flex flex-col text-right px-4 py-2 bg-white/5 border border-white/5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
              CYCLE SURPLUS
            </span>
            <span className={`text-base font-black ${netEarnings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {preferences.currency}
              {netEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <Button
            onClick={onOpenAddModal}
            variant="primary"
            className="flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 py-2.5 rounded-2xl cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Record Entry</span>
          </Button>
        </div>
      </div>

      {/* Grid: Financial Stats Summary Cards */}
      <StatCards />

      {/* Grid: Secondary Layout (Recent Ledger lists & Analytics panel widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Recent Ledger (Occupies 2 spans on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Wallet className="h-4 w-4 text-blue-500" />
              Recent Ledger Streams
            </h2>
            <button
              onClick={() => setActivePage('transactions')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1 transition-all cursor-pointer hover:translate-x-0.5"
            >
              <span>View Full Ledger</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <TransactionTable
            onEdit={onEditTransaction}
            onOpenAddModal={onOpenAddModal}
            limit={5}
          />
        </div>

        {/* Right Column: Health Monitor & Alerts (Occupies 1 span) */}
        <div className="flex flex-col gap-6">
          <FinancialHealth />
          <SpendingAlerts />
        </div>
      </div>
    </div>
  );
};
