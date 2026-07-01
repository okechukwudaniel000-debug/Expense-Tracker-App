/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { ToastContainer } from './components/ui/Toast';
import { TransactionModal } from './components/transactions/TransactionModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { TransactionsView } from './components/views/TransactionsView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { AboutView } from './components/views/AboutView';

import { Transaction } from './types';

const MainAppContent: React.FC = () => {
  const { activePage, setActivePage } = useExpenses();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Transaction Modal State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  // Keyboard Shortcuts implementation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key shortcuts if user is typing in form inputs, textareas or select inputs
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      switch (key) {
        case 'N':
          e.preventDefault();
          handleOpenAddModal();
          break;
        case 'D':
          e.preventDefault();
          setActivePage('dashboard');
          break;
        case 'T':
          e.preventDefault();
          setActivePage('transactions');
          break;
        case 'R':
          e.preventDefault();
          setActivePage('reports');
          break;
        case 'S':
          e.preventDefault();
          setActivePage('transactions');
          // Wait briefly for page swap before seeking search element focus
          setTimeout(() => {
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              searchInput.select();
            }
          }, 100);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActivePage]);

  // Render current active page view screen
  const renderView = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenAddModal={handleOpenAddModal}
            onEditTransaction={handleEditTransaction}
          />
        );
      case 'transactions':
        return (
          <TransactionsView
            onOpenAddModal={handleOpenAddModal}
            onEditTransaction={handleEditTransaction}
          />
        );
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'about':
        return <AboutView />;
      default:
        // Fallback or 404
        return (
          <div className="flex flex-col items-center justify-center py-24 select-none animate-fade-in text-center">
            <h2 className="text-4xl font-black text-slate-800 dark:text-white leading-none">404</h2>
            <p className="text-sm font-semibold text-slate-500 mt-2">The requested view page is unavailable.</p>
            <button
              onClick={() => setActivePage('dashboard')}
              className="text-xs font-bold text-blue-500 hover:underline mt-4 cursor-pointer"
            >
              Return to dashboard overview
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar - Desktop Layout */}
      <Sidebar />

      {/* Mobile Drawer Navigation layout */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main viewport Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderView()}
        </main>
      </div>

      {/* Global Transaction Form Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        editingTransaction={editingTransaction}
      />

      {/* Toast Alert Framework overlay */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <MainAppContent />
      </ExpenseProvider>
    </ThemeProvider>
  );
}
