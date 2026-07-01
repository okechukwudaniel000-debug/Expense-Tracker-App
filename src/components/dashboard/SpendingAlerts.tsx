/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { AlertTriangle, ShieldCheck, Flame, TrendingDown, Bell } from 'lucide-react';

export const SpendingAlerts: React.FC = () => {
  const { transactions, preferences } = useExpenses();

  const alerts = React.useMemo(() => {
    let income = 0;
    let expenses = 0;
    const categoryTotals: { [key: string]: number } = {};

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expenses += tx.amount;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      }
    });

    const list: { id: string; type: 'danger' | 'warning' | 'info'; title: string; desc: string }[] = [];

    const budget = preferences.monthlyBudget || 1;

    // 1. Check total budget depletion
    const usageRatio = expenses / budget;
    if (usageRatio > 1.0) {
      list.push({
        id: 'budget-depleted',
        type: 'danger',
        title: 'Budget Threshold Breached',
        desc: `Your total spending (${preferences.currency}${expenses.toLocaleString()}) has exceeded your specified monthly allocation.`,
      });
    } else if (usageRatio >= 0.8) {
      list.push({
        id: 'budget-warning',
        type: 'warning',
        title: 'Budget Depletion Risk',
        desc: `You have consumed ${(usageRatio * 100).toFixed(0)}% of your monthly liquidity budget. Secondary limits recommended.`,
      });
    }

    // 2. Concentration risk: if any category is > 25% of total budget
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      const catRatio = val / budget;
      if (catRatio > 0.25) {
        list.push({
          id: `concentration-${cat}`,
          type: 'warning',
          title: `Concentration: ${cat}`,
          desc: `Expenses under "${cat}" represent ${(catRatio * 100).toFixed(0)}% of your global monthly allocation buffer.`,
        });
      }
    });

    // 3. Negative Net Flow
    if (expenses > income && transactions.length > 2) {
      list.push({
        id: 'cash-negative',
        type: 'danger',
        title: 'Deficit Operating Balance',
        desc: `Outflow velocity is outpacing revenue inflow. Operating at a net loss of ${preferences.currency}${(expenses - income).toLocaleString()} for this cycle.`,
      });
    }

    return list;
  }, [transactions, preferences]);

  return (
    <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-5 flex flex-col hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-blue-500 shrink-0" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Active Expenditure Warnings
        </h3>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center h-full select-none">
            <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-full border border-emerald-500/10 mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No active alerts detected</p>
            <p className="text-xs text-slate-400 mt-0.5 px-4 font-medium">
              Excellent! Your categories are diversified, and cash flow margins are fully secure.
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex gap-3 p-3.5 rounded-xl border ${
                alert.type === 'danger'
                  ? 'bg-rose-500/[0.03] border-rose-500/10 dark:border-rose-500/20 text-rose-800 dark:text-rose-200'
                  : alert.type === 'warning'
                  ? 'bg-amber-500/[0.03] border-amber-500/10 dark:border-amber-500/20 text-amber-800 dark:text-amber-200'
                  : 'bg-sky-500/[0.03] border-sky-500/10 dark:border-sky-500/20 text-sky-800 dark:text-sky-200'
              }`}
            >
              {alert.type === 'danger' ? (
                <TrendingDown className="h-5 w-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
              ) : alert.type === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <Flame className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wide">{alert.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {alert.desc}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
