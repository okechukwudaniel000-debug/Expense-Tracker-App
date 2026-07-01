/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral' | 'custom';
  colorClass?: string;
  textColorClass?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  colorClass = '',
  textColorClass = '',
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full select-none';
  
  const variants = {
    primary: 'bg-blue-500/10 text-blue-500',
    success: 'bg-emerald-500/10 text-emerald-500',
    danger: 'bg-rose-500/10 text-rose-500',
    warning: 'bg-amber-500/10 text-amber-500',
    neutral: 'bg-slate-500/10 text-slate-500 dark:text-slate-400',
    custom: `${colorClass} ${textColorClass}`,
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
