/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExpenses } from '../../context/ExpenseContext';
import { Transaction } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const transactionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(50, 'Title is too long (maximum 50 characters)'),
  amount: z
    .any()
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, 'Amount must be a positive number'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Please provide a valid date',
  }),
  description: z
    .string()
    .max(140, 'Description cannot exceed 140 characters')
    .optional()
    .or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

interface TransactionFormValues {
  title: string;
  amount: any;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
  notes?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editingTransaction,
}) => {
  const { addTransaction, updateTransaction, categories } = useExpenses();

  const defaultValues = React.useMemo(() => {
    if (editingTransaction) {
      return {
        title: editingTransaction.title,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: editingTransaction.date,
        description: editingTransaction.description || '',
        notes: editingTransaction.notes || '',
      };
    }
    
    // Default values for new transaction
    return {
      title: '',
      amount: '',
      type: 'expense' as const,
      category: categories[0]?.name || 'Food',
      date: new Date().toISOString().split('T')[0],
      description: '',
      notes: '',
    };
  }, [editingTransaction, categories, isOpen]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  // Watch type change to recommend categories if needed
  const selectedType = watch('type');

  // Reset values when modal opens/closes or transition edit mode
  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset, defaultValues]);

  const onSubmit = (data: TransactionFormValues) => {
    const formattedData = {
      ...data,
      amount: Number(data.amount),
    };
    if (editingTransaction) {
      updateTransaction({
        ...editingTransaction,
        ...formattedData,
      });
    } else {
      addTransaction(formattedData);
    }
    onClose();
    reset();
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  const typeOptions = [
    { value: 'expense', label: 'Expense (Outflow)' },
    { value: 'income', label: 'Income (Inflow)' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTransaction ? 'Edit Transaction Details' : 'Record New Transaction'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 select-none">
        {/* Type selector */}
        <Select
          label="Transaction Direction"
          options={typeOptions}
          error={errors.type?.message}
          {...register('type')}
        />

        {/* Title */}
        <Input
          label="Transaction Title"
          placeholder="e.g. Whole Foods Groceries"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Amount */}
          <Input
            label="Transaction Amount"
            type="number"
            step="any"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount')}
          />

          {/* Date */}
          <Input
            label="Booking Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        {/* Category */}
        <Select
          label="Financial Category"
          options={categoryOptions}
          error={errors.category?.message}
          {...register('category')}
        />

        {/* Short description */}
        <Input
          label="Brief Description"
          placeholder="e.g. Weekly stock up for prep meals"
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Notes (Detailed context) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
            Internal Notes
          </label>
          <textarea
            rows={2}
            placeholder="Add ledger annotations, receipt details, or billing codes..."
            className={`w-full bg-white dark:bg-[#131313] text-slate-900 dark:text-white border ${
              errors.notes
                ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
            } rounded-lg px-3 py-2 text-sm transition-all outline-none focus:ring-4`}
            {...register('notes')}
          />
          {errors.notes && (
            <span className="text-xs font-medium text-rose-500" role="alert">
              {errors.notes.message}
            </span>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-50 dark:border-slate-800/40 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {editingTransaction ? 'Save Adjustments' : 'Commit Entry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
