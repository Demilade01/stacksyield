// Zustand store for wallet state management
import { create } from 'zustand';
import { WalletState } from '../types';
import { connectEthereumWallet, disconnectEthereumWallet, getUSDCBalance } from '../ethereum-provider';
import {
  connectStacksWallet,
  disconnectStacksWallet,
  getStacksAddress,
  checkStacksConnection
} from '../stacks-provider';

interface WalletStore extends WalletState {
  connectEthereum: () => Promise<void>;
  disconnectEthereum: () => void;
  connectStacks: () => Promise<void>;
  disconnectStacks: () => void;
  updateBalances: () => Promise<void>;
  setEthereumBalance: (balance: string) => void;
  setStacksBalance: (balance: string) => void;
  checkConnections: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  ethereum: {
    address: null,
    balance: '0',
    isConnected: false,
  },
  stacks: {
    address: null,
    balance: '0',
    isConnected: false,
  },

  connectEthereum: async () => {
    try {
      const address = await connectEthereumWallet();
      const balance = await getUSDCBalance(address);

      set({
        ethereum: {
          address,
          balance,
          isConnected: true,
        },
      });
    } catch (error) {
      console.error('Failed to connect Ethereum wallet:', error);
      throw error;
    }
  },

  disconnectEthereum: () => {
    disconnectEthereumWallet();
    set({
      ethereum: {
        address: null,
        balance: '0',
        isConnected: false,
      },
    });
  },

  connectStacks: async () => {
    try {
      const address = await connectStacksWallet();

      if (!address) {
        throw new Error('No address returned from wallet');
      }

      set({
        stacks: {
          address,
          balance: '0', // Will be updated by updateBalances
          isConnected: true,
        },
      });

      // Update balance after connection
      await get().updateBalances();
    } catch (error) {
      console.error('Failed to connect Stacks wallet:', error);
      throw error;
    }
  },

  disconnectStacks: () => {
    disconnectStacksWallet();
    set({
      stacks: {
        address: null,
        balance: '0',
        isConnected: false,
      },
    });
  },

  checkConnections: () => {
    // Check if Stacks is still connected on page load
    const isStacksConnected = checkStacksConnection();

    if (isStacksConnected) {
      const address = getStacksAddress();
      if (address) {
        set((state) => ({
          stacks: {
            ...state.stacks,
            address,
            isConnected: true,
          },
        }));
      }
    }
  },

  updateBalances: async () => {
    const { ethereum, stacks } = get();

    // Update Ethereum USDC balance
    if (ethereum.address) {
      try {
        const balance = await getUSDCBalance(ethereum.address);
        set((state) => ({
          ethereum: { ...state.ethereum, balance },
        }));
      } catch (error) {
        console.error('Failed to update Ethereum balance:', error);
      }
    }

    // Update Stacks USDCx balance
    if (stacks.address) {
      try {
        // TODO: Implement Stacks USDCx balance fetch
        // const balance = await getStacksUSDCxBalance(stacks.address);
        // For now, mock it
        set((state) => ({
          stacks: { ...state.stacks, balance: '0' },
        }));
      } catch (error) {
        console.error('Failed to update Stacks balance:', error);
      }
    }
  },

  setEthereumBalance: (balance: string) => {
    set((state) => ({
      ethereum: { ...state.ethereum, balance },
    }));
  },

  setStacksBalance: (balance: string) => {
    set((state) => ({
      stacks: { ...state.stacks, balance },
    }));
  },
}));
