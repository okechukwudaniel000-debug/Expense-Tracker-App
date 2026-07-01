/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  type = 'button',
  id,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/10 border border-transparent',
    secondary: 'bg-slate-100 dark:bg-[#1f1f1f] hover:bg-slate-200 dark:hover:bg-[#2b2b2b] text-slate-800 dark:text-slate-200 border border-transparent',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border border-transparent',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm border border-transparent',
    warning: 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm border border-transparent',
    outline: 'bg-transparent hover:bg-slate-50 dark:hover:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800',
    ghost: 'bg-transparent hover:bg-slate-50 dark:hover:bg-[#1a1a1a] text-slate-700 dark:text-slate-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold',
    md: 'px-4 py-2 text-sm font-semibold',
    lg: 'px-5 py-2.5 text-base font-semibold',
    icon: 'p-2 rounded-lg',
  };

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
};
