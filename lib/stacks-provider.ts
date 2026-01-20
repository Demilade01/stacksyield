// Stacks blockchain provider utilities - Using modern @stacks/connect API
'use client';

import { config } from './config';

// Lazy imports to avoid SSR issues
let connectModule: any = null;

const getConnectModule = async () => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!connectModule) {
    connectModule = await import('@stacks/connect');
  }

  return connectModule;
};

export const getStacksNetwork = () => {
  // Return network string for API calls
  return config.stacks.network === 'mainnet' ? 'mainnet' : 'testnet';
};

export const connectStacksWallet = async (): Promise<string> => {
  if (typeof window === 'undefined') {
    throw new Error('Wallet connection only available in browser');
  }

  try {
    const module = await getConnectModule();
    if (!module) {
      throw new Error('Connect module not available');
    }

    const { connect } = module;
    const response = await connect();

    // Access addresses array (type assertion for the response structure)
    const addresses = (response as any)?.addresses;
    if (!addresses?.stx || addresses.stx.length === 0) {
      throw new Error('No Stacks address returned from wallet');
    }

    // Get the first STX address
    const stxAddress = addresses.stx[0].address;
    return stxAddress;
  } catch (error) {
    console.error('Error connecting Stacks wallet:', error);
    throw error;
  }
};

export const disconnectStacksWallet = async () => {
  if (typeof window === 'undefined') return;

  const module = await getConnectModule();
  if (module) {
    module.disconnect();
  }
};

export const getStacksAddress = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  try {
    const module = await getConnectModule();
    if (!module) return null;

    const { isConnected, getLocalStorage } = module;

    if (!isConnected()) {
      return null;
    }

    const userData = getLocalStorage();
    const addresses = (userData as any)?.addresses;
    if (addresses?.stx && addresses.stx.length > 0) {
      return addresses.stx[0].address;
    }

    return null;
  } catch (error) {
    console.error('Error getting Stacks address:', error);
    return null;
  }
};

export const checkStacksConnection = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  try {
    const module = await getConnectModule();
    if (!module) return false;

    return module.isConnected();
  } catch (error) {
    return false;
  }
};
