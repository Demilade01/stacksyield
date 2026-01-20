// Zustand store for bridge transaction management
import { create } from 'zustand';
import { BridgeTransaction } from '../types';

interface BridgeStore {
  transactions: BridgeTransaction[];
  currentTransaction: BridgeTransaction | null;
  addTransaction: (transaction: BridgeTransaction) => void;
  updateTransaction: (id: string, updates: Partial<BridgeTransaction>) => void;
  setCurrentTransaction: (transaction: BridgeTransaction | null) => void;
  clearTransactions: () => void;
}

export const useBridgeStore = create<BridgeStore>((set) => ({
  transactions: [],
  currentTransaction: null,

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      currentTransaction: transaction,
    })),

  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
      currentTransaction:
        state.currentTransaction?.id === id
          ? { ...state.currentTransaction, ...updates }
          : state.currentTransaction,
    })),

  setCurrentTransaction: (transaction) =>
    set({ currentTransaction: transaction }),

  clearTransactions: () =>
    set({ transactions: [], currentTransaction: null }),
}));
