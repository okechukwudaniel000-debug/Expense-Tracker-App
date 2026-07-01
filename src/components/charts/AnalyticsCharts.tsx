/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label, currency = '$' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#131313] border border-slate-100 dark:border-slate-800 p-3 rounded-xl shadow-2xl select-none">
        <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-black" style={{ color: entry.color || entry.fill }}>
            {entry.name}: {currency}{Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 1. AREA CHART: Monthly Expense & Income Trends
export const MonthlyTrendChart: React.FC = () => {
  const { transactions, preferences } = useExpenses();

  const data = React.useMemo(() => {
    // Group transactions by date, spanning past 10 entries for visual trend
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Aggregate by date (YYYY-MM-DD)
    const map: { [key: string]: { date: string; Income: number; Expenses: number } } = {};
    
    sorted.forEach((tx) => {
      const dateStr = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!map[dateStr]) {
        map[dateStr] = { date: dateStr, Income: 0, Expenses: 0 };
      }
      if (tx.type === 'income') {
        map[dateStr].Income += tx.amount;
      } else {
        map[dateStr].Expenses += tx.amount;
      }
    });

    return Object.values(map).slice(-10); // past 10 records with aggregated dates
  }, [transactions]);

  if (data.length === 0) return <EmptyChartState />;

  return (
    <div className="h-[300px] w-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b10" className="dark:stroke-slate-800/20" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${preferences.currency}${value}`}
          />
          <Tooltip content={<CustomTooltip currency={preferences.currency} />} />
          <Area
            type="monotone"
            dataKey="Income"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          <Area
            type="monotone"
            dataKey="Expenses"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpenses)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. SIDE-BY-SIDE BAR CHART: Income vs Expenses totals
export const IncomeVsExpensesChart: React.FC = () => {
  const { transactions, preferences } = useExpenses();

  const data = React.useMemo(() => {
    let incomeSum = 0;
    let expenseSum = 0;
    
    transactions.forEach((tx) => {
      if (tx.type === 'income') incomeSum += tx.amount;
      else expenseSum += tx.amount;
    });

    return [
      { name: 'Summary', Income: incomeSum, Expenses: expenseSum },
    ];
  }, [transactions]);

  if (transactions.length === 0) return <EmptyChartState />;

  return (
    <div className="h-[300px] w-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b10" className="dark:stroke-slate-800/20" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip currency={preferences.currency} />} />
          <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
          <Bar dataKey="Income" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={60} />
          <Bar dataKey="Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. PIE CHART: Category Distribution
export const CategoryDistributionChart: React.FC = () => {
  const { transactions, categories, preferences } = useExpenses();

  const data = React.useMemo(() => {
    const map: { [key: string]: number } = {};
    
    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      });

    const colorsMap: { [key: string]: string } = {};
    categories.forEach((cat) => {
      // derive hex from category colors or defaults
      colorsMap[cat.name] = cat.textColor.includes('rose') ? '#f43f5e' :
                            cat.textColor.includes('sky') ? '#0ea5e9' :
                            cat.textColor.includes('amber') ? '#f59e0b' :
                            cat.textColor.includes('purple') ? '#a855f7' :
                            cat.textColor.includes('pink') ? '#ec4899' :
                            cat.textColor.includes('emerald') ? '#10b981' :
                            cat.textColor.includes('indigo') ? '#6366f1' :
                            cat.textColor.includes('teal') ? '#14b8a6' :
                            cat.textColor.includes('cyan') ? '#06b6d4' :
                            cat.textColor.includes('violet') ? '#8b5cf6' :
                            cat.textColor.includes('blue') ? '#3b82f6' :
                            cat.textColor.includes('green') ? '#22c55e' : '#64748b';
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: colorsMap[name] || '#3b82f6',
    }));
  }, [transactions, categories]);

  if (data.length === 0) return <EmptyChartState label="No expense distributions compiled" />;

  return (
    <div className="h-[300px] w-full flex flex-col md:flex-row items-center justify-center gap-6 select-none">
      <div className="h-[220px] w-[220px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={preferences.currency} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="flex-1 flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-2 w-full">
        {data.map((entry, idx) => {
          const total = data.reduce((sum, item) => sum + item.value, 0);
          const percent = ((entry.value / total) * 100).toFixed(1);
          return (
            <div key={idx} className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{entry.name}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-800 dark:text-white mr-1.5">{preferences.currency}{entry.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span className="text-slate-400">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. LINE CHART: Weekly Activity
export const WeeklyActivityChart: React.FC = () => {
  const { transactions, preferences } = useExpenses();

  const data = React.useMemo(() => {
    // Generate past 7 days aggregate
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map: { [key: string]: { day: string; Amount: number } } = {};
    
    // Seed map with past 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      map[dayName] = { day: dayName, Amount: 0 };
    }

    // Populate actual spending (expenses only)
    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        const txDate = new Date(tx.date);
        const diffTime = Math.abs(new Date().getTime() - txDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
          const dayName = days[txDate.getDay()];
          if (map[dayName]) {
            map[dayName].Amount += tx.amount;
          }
        }
      }
    });

    return Object.values(map);
  }, [transactions]);

  if (transactions.length === 0) return <EmptyChartState />;

  return (
    <div className="h-[300px] w-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b10" className="dark:stroke-slate-800/20" />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip currency={preferences.currency} />} />
          <Line
            type="monotone"
            dataKey="Amount"
            name="Daily Spend"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Secondary empty wrapper
const EmptyChartState: React.FC<{ label?: string }> = ({ label = 'No transaction data available' }) => {
  return (
    <div className="h-[250px] w-full flex flex-col items-center justify-center text-center select-none bg-slate-50/50 dark:bg-[#111111]/40 border border-dashed border-slate-150 dark:border-slate-800/50 rounded-2xl p-6">
      <p className="text-sm font-semibold text-slate-400">{label}</p>
      <p className="text-xs text-slate-300 dark:text-slate-600 mt-1 font-medium">Accumulate entries to compile live visual data models.</p>
    </div>
  );
};
