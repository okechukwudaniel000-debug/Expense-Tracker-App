/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const uniqueId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={uniqueId}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase select-none"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            id={uniqueId}
            ref={ref}
            className={`w-full appearance-none bg-white dark:bg-[#131313] text-slate-900 dark:text-white border ${
              error
                ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
            } rounded-lg pl-3 pr-10 py-2 text-sm transition-all outline-none focus:ring-4 select-none cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#131313]">
                {opt.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {error && (
          <span className="text-xs font-medium text-rose-500 select-none animate-slide-in" role="alert">
            {error}
          </span>
        )}

        {!error && helperText && (
          <span className="text-xs text-slate-500 dark:text-slate-400 select-none">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
