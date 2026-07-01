/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Wallet, ArrowUpRight, ArrowDownRight, PiggyBank, Target, Flame } from 'lucide-react';

export const StatCards: React.FC = () => {
  const { transactions, preferences, categories } = useExpenses();

  // Financial Calculations
  const calculations = React.useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    // Categorized expense summary
    const categoryTotals: { [key: string]: number } = {};

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      }
    });

    const balance = totalIncome - totalExpense;
    const savings = Math.max(0, balance);
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    // Get highest expense category
    let highestCatName = 'N/A';
    let highestCatVal = 0;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > highestCatVal) {
        highestCatVal = val;
        highestCatName = cat;
      }
    });

    // Monthly limit percentage
    const budgetUsagePercent = preferences.monthlyBudget > 0 
      ? (totalExpense / preferences.monthlyBudget) * 100 
      : 0;

    return {
      balance,
      totalIncome,
      totalExpense,
      savings,
      savingsRate,
      highestCategory: `${highestCatName} (${preferences.currency}${highestCatVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })})`,
      highestCatVal,
      budgetUsagePercent,
    };
  }, [transactions, preferences]);

  const { currency } = preferences;

  const cardData = [
    {
      title: 'Current Balance',
      value: `${currency}${calculations.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      subtitle: 'Net liquidity available',
      icon: <Wallet className="h-5 w-5 text-blue-500" />,
      colorClass: 'border-blue-500/10 hover:border-blue-500/20 shadow-blue-500/[0.02]',
      trend: calculations.balance >= 0 ? 'Positive Net Value' : 'Negative Net Value',
      trendType: calculations.balance >= 0 ? 'success' : 'danger',
    },
    {
      title: 'Total Income',
      value: `${currency}${calculations.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      subtitle: 'Cumulated revenue inflow',
      icon: <ArrowUpRight className="h-5 w-5 text-emerald-500" />,
      colorClass: 'border-emerald-500/10 hover:border-emerald-500/20 shadow-emerald-500/[0.02]',
      trend: 'All-time credit state',
      trendType: 'success',
    },
    {
      title: 'Total Expenses',
      value: `${currency}${calculations.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      subtitle: 'Cumulated debt outflow',
      icon: <ArrowDownRight className="h-5 w-5 text-rose-500" />,
      colorClass: 'border-rose-500/10 hover:border-rose-500/20 shadow-rose-500/[0.02]',
      trend: `${((calculations.totalExpense / (calculations.totalIncome || 1)) * 100).toFixed(0)}% of earnings spent`,
      trendType: 'neutral',
    },
    {
      title: 'Net Savings',
      value: `${currency}${calculations.savings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      subtitle: `Savings Rate: ${calculations.savingsRate.toFixed(1)}%`,
      icon: <PiggyBank className="h-5 w-5 text-indigo-500" />,
      colorClass: 'border-indigo-500/10 hover:border-indigo-500/20 shadow-indigo-500/[0.02]',
      trend: calculations.savingsRate >= 20 ? 'Strong savings velocity' : 'Increase savings margin',
      trendType: calculations.savingsRate >= 20 ? 'success' : 'warning',
    },
    {
      title: 'Monthly Budget',
      value: `${currency}${preferences.monthlyBudget.toLocaleString()}`,
      subtitle: `${calculations.budgetUsagePercent.toFixed(1)}% utilized`,
      icon: <Target className="h-5 w-5 text-purple-500" />,
      colorClass: 'border-purple-500/10 hover:border-purple-500/20 shadow-purple-500/[0.02]',
      trend: `${calculations.budgetUsagePercent > 100 ? 'Over budget limit!' : 'Within safe parameters'}`,
      trendType: calculations.budgetUsagePercent > 100 ? 'danger' : 'success',
      progress: calculations.budgetUsagePercent,
    },
    {
      title: 'Top Category',
      value: calculations.highestCategory,
      subtitle: 'Largest outflow target',
      icon: <Flame className="h-5 w-5 text-amber-500" />,
      colorClass: 'border-amber-500/10 hover:border-amber-500/20 shadow-amber-500/[0.02]',
      trend: calculations.highestCatVal > 0 ? 'High priority cost center' : 'No expenses recorded',
      trendType: calculations.highestCatVal > 0 ? 'warning' : 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 select-none animate-fade-in">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className={`bg-white dark:bg-[#131313] border rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.015] hover:shadow-lg transition-all duration-300 ${card.colorClass}`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {card.title}
            </span>
            <div className="p-2.5 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-100 dark:border-slate-800/40">
              {card.icon}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {card.value}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
              {card.subtitle}
            </span>
          </div>

          {/* Optional progress indicator for budget card */}
          {card.progress !== undefined && (
            <div className="w-full bg-slate-100 dark:bg-[#202020] h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  card.progress > 100
                    ? 'bg-rose-500'
                    : card.progress > 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, card.progress)}%` }}
              />
            </div>
          )}

          <div className="border-t border-slate-50 dark:border-[#1d1d1d] mt-4 pt-3 flex items-center justify-between">
            <span
              className={`text-xs font-bold ${
                card.trendType === 'success'
                  ? 'text-emerald-500'
                  : card.trendType === 'danger'
                  ? 'text-rose-500'
                  : card.trendType === 'warning'
                  ? 'text-amber-500'
                  : 'text-slate-400'
              }`}
            >
              {card.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
