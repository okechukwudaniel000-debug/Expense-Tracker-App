/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, type = 'text', ...props }, ref) => {
    const uniqueId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

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
        
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            id={uniqueId}
            ref={ref}
            type={type}
            className={`w-full bg-white dark:bg-[#131313] text-slate-900 dark:text-white border ${
              error
                ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
            } rounded-lg px-3 py-2 text-sm transition-all outline-none focus:ring-4 ${
              icon ? 'pl-10' : ''
            } ${className}`}
            {...props}
          />
        </div>

        {error && (
          <span className="text-xs font-medium text-rose-500 animate-slide-in select-none" role="alert">
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

Input.displayName = 'Input';
