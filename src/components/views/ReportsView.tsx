/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import {
  MonthlyTrendChart,
  IncomeVsExpensesChart,
  CategoryDistributionChart,
  WeeklyActivityChart,
} from '../charts/AnalyticsCharts';
import { TrendingUp, Award, BarChart3, HelpCircle, Activity, Heart, PiggyBank } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { transactions, preferences } = useExpenses();

  // Calculate quick analytical pointers
  const analyticsData = React.useMemo(() => {
    let incomeSum = 0;
    let expenseSum = 0;
    let expenseCount = 0;
    
    // Day set to calculate average daily spend
    const uniqueExpenseDates = new Set<string>();

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        incomeSum += tx.amount;
      } else {
        expenseSum += tx.amount;
        expenseCount++;
        uniqueExpenseDates.add(tx.date);
      }
    });

    const retentionRate = incomeSum > 0 ? ((incomeSum - expenseSum) / incomeSum) * 100 : 0;
    
    // Average daily expense speed
    const daysMeasured = Math.max(1, uniqueExpenseDates.size);
    const avgDailySpend = expenseSum / daysMeasured;

    return {
      retentionRate,
      avgDailySpend,
      expenseCount,
      netSavings: Math.max(0, incomeSum - expenseSum),
    };
  }, [transactions]);

  const { currency } = preferences;

  const quickStats = [
    {
      title: 'Inflow Retention',
      value: `${analyticsData.retentionRate.toFixed(1)}%`,
      subtitle: 'Ratio of earnings conserved',
      icon: <PiggyBank className="h-5 w-5 text-emerald-500" />,
      color: 'text-emerald-500',
    },
    {
      title: 'Average Outflow Speed',
      value: `${currency}${analyticsData.avgDailySpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      subtitle: 'Per-active-booking-day spending',
      icon: <Activity className="h-5 w-5 text-blue-500" />,
      color: 'text-blue-500',
    },
    {
      title: 'Ledger Audit Volume',
      value: transactions.length.toString(),
      subtitle: 'Total recorded cash actions',
      icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="flex flex-col gap-6 select-none animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col border-b border-slate-100 dark:border-slate-900 pb-5 select-none">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-500" />
          Financial Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Deep-dive diagnostic charts tracking income flows, spending trends, and category distribution structures.
        </p>
      </div>

      {/* Analytics High-level Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {quickStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all duration-300"
          >
            <div className="p-3 bg-slate-50 dark:bg-[#1c1c1c] rounded-xl border border-slate-100 dark:border-slate-800/40">
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                {stat.title}
              </span>
              <span className={`text-xl font-black ${stat.color} mt-0.5 leading-none`}>
                {stat.value}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                {stat.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Analytical Charts Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Card 1: Monthly Trend */}
        <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col mb-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Outflow vs Inflow Velocity
            </h3>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              Monthly Cash Flow Streams
            </span>
          </div>
          <MonthlyTrendChart />
        </div>

        {/* Chart Card 2: Category Distribution */}
        <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col mb-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Category Capital Allocation
            </h3>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              Outflow Concentration Ratio
            </span>
          </div>
          <CategoryDistributionChart />
        </div>

        {/* Chart Card 3: Income vs Expenses totals */}
        <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col mb-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Global Balance Calibration
            </h3>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              Consolidated Net Liquidity Position
            </span>
          </div>
          <IncomeVsExpensesChart />
        </div>

        {/* Chart Card 4: Daily Activity */}
        <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col mb-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Short-term Expenditure Rhythm
            </h3>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              Active Weekly Activity Feed (Past 7 Days)
            </span>
          </div>
          <WeeklyActivityChart />
        </div>
      </div>
    </div>
  );
};
