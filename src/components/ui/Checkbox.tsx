/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', id, ...props }) => {
  const uniqueId = id || `chk-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="flex items-center gap-2">
      <input
        id={uniqueId}
        type="checkbox"
        className={`h-4 w-4 rounded border-slate-300 dark:border-slate-800 text-blue-600 focus:ring-blue-500/20 dark:bg-[#131313] transition-all cursor-pointer ${className}`}
        {...props}
      />
      {label && (
        <label
          htmlFor={uniqueId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
};
