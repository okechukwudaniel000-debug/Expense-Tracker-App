/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Toast as ToastType } from '../../types';
import { useExpenses } from '../../context/ExpenseContext';
import { X, CheckCircle2, AlertCircle, Info, RotateCcw } from 'lucide-react';

interface ToastProps {
  toast: ToastType;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useExpenses();

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-500 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/10 dark:border-emerald-500/20',
    error: 'border-rose-500/10 dark:border-rose-500/20',
    warning: 'border-amber-500/10 dark:border-amber-500/20',
    info: 'border-sky-500/10 dark:border-sky-500/20',
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 min-w-[320px] max-w-md bg-white dark:bg-[#131313] text-slate-800 dark:text-slate-100 rounded-xl shadow-2xl p-4 border ${borderColors[toast.type]} animate-fade-in-up transition-all hover:scale-[1.01]`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold leading-relaxed">{toast.message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {toast.undoAction && (
          <button
            onClick={() => {
              if (toast.undoAction) {
                toast.undoAction();
                removeToast(toast.id);
              }
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-blue-500/10 dark:bg-blue-500/20 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-md transition-all active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Undo
          </button>
        )}
        <button
          onClick={() => removeToast(toast.id)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useExpenses();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};
