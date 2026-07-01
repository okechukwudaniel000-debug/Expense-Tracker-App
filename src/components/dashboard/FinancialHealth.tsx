/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Activity, ShieldCheck, HelpCircle, ArrowUpRight } from 'lucide-react';

export const FinancialHealth: React.FC = () => {
  const { transactions, preferences } = useExpenses();

  const metrics = React.useMemo(() => {
    let income = 0;
    let expenses = 0;
    
    transactions.forEach((tx) => {
      if (tx.type === 'income') income += tx.amount;
      else expenses += tx.amount;
    });

    // Score calculations
    let score = 0;
    
    // 1. Savings velocity score (Max 35 points)
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    if (savingsRate >= 30) score += 35;
    else if (savingsRate >= 15) score += 25;
    else if (savingsRate > 0) score += 10;
    else score += 0;

    // 2. Budget containment score (Max 35 points)
    const budget = preferences.monthlyBudget || 1;
    const budgetSpentRate = (expenses / budget) * 100;
    if (budgetSpentRate < 50) score += 35;
    else if (budgetSpentRate <= 80) score += 25;
    else if (budgetSpentRate <= 100) score += 15;
    else score += 0;

    // 3. Financial Activity & Safety buffer (Max 30 points)
    const txCount = transactions.length;
    if (txCount > 8 && income > 0) score += 30;
    else if (txCount > 4) score += 20;
    else if (txCount > 0) score += 10;

    let grade = 'NEUTRAL';
    let gradeColor = 'text-slate-400';
    let ringColor = 'stroke-slate-200 dark:stroke-slate-800';
    let description = 'Insufficient transactions to calibrate assessment model.';
    let recommendations: string[] = [];

    if (txCount > 0) {
      if (score >= 80) {
        grade = 'OPTIMAL';
        gradeColor = 'text-emerald-500';
        ringColor = 'stroke-emerald-500';
        description = 'Excellent financial discipline. Liquid reserve velocity and budget containment are in prime balance.';
        recommendations = [
          'Allocate a percentage of current net surplus to automated index investments.',
          'Review recurring subscriptions to maintain optimized margins.',
        ];
      } else if (score >= 55) {
        grade = 'STABLE';
        gradeColor = 'text-blue-500';
        ringColor = 'stroke-blue-500';
        description = 'Solid financial posture. You maintain positive balance liquidity but budget threshold adjustments are advised.';
        recommendations = [
          'Identify and curtail discretionary shopping costs slightly.',
          'Build an emergency liquidity buffer equal to 3 months of expenses.',
        ];
      } else {
        grade = 'CRITICAL';
        gradeColor = 'text-rose-500';
        ringColor = 'stroke-rose-500';
        description = 'Over-leveraged expenditure posture. Savings velocity has dropped below threshold safety levels.';
        recommendations = [
          'Immediately cap secondary entertainment and non-essential outflows.',
          'Consider secondary freelance pipelines to boost overall baseline revenue.',
        ];
      }
    } else {
      recommendations = ['Add a few expenses or salary payouts to calibrate indicators.'];
    }

    return {
      score,
      grade,
      gradeColor,
      ringColor,
      description,
      recommendations,
      savingsRate,
      budgetSpentRate,
    };
  }, [transactions, preferences]);

  // SVG parameters for progress ring
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (metrics.score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-900 rounded-2xl p-5 flex flex-col hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-blue-500 shrink-0" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Financial Health Indicator
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
        {/* Dynamic Animated Circular Meter */}
        <div className="relative h-32 w-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-slate-100 dark:stroke-[#1c1c1c]"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className={`transition-all duration-1000 ease-out ${metrics.ringColor}`}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {metrics.score}
            </span>
            <span className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase leading-none">
              INDEX SCORE
            </span>
          </div>
        </div>

        {/* Narrative assessment */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-1.5 justify-center sm:justify-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Posture Assessment:
            </span>
            <span className={`text-xs font-black tracking-widest ${metrics.gradeColor}`}>
              {metrics.grade}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-center sm:text-left">
            {metrics.description}
          </p>
        </div>
      </div>

      {/* Structured recommendations */}
      <div className="border-t border-slate-50 dark:border-[#1c1c1c] mt-4 pt-4 flex flex-col gap-2">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Optimizations Feed:
        </h4>
        <ul className="flex flex-col gap-2">
          {metrics.recommendations.map((rec, idx) => (
            <li
              key={idx}
              className="bg-slate-50/50 dark:bg-[#181818]/40 border border-slate-100/50 dark:border-slate-800/20 px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-start gap-2 hover:translate-x-0.5 transition-transform"
            >
              <ArrowUpRight className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
