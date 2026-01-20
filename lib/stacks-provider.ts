// Stacks blockchain provider utilities - Using modern @stacks/connect API
import { connect, disconnect, isConnected, getLocalStorage } from '@stacks/connect';
import { config } from './config';

export const getStacksNetwork = () => {
  // Return network string for API calls
  return config.stacks.network === 'mainnet' ? 'mainnet' : 'testnet';
};

export const connectStacksWallet = async (): Promise<string> => {
  try {
    // Use the modern connect() API instead of showConnect()
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

export const disconnectStacksWallet = () => {
  disconnect();
};

export const getStacksAddress = (): string | null => {
  if (!isConnected()) {
    return null;
  }

  const userData = getLocalStorage();
  const addresses = (userData as any)?.addresses;
  if (addresses?.stx && addresses.stx.length > 0) {
    return addresses.stx[0].address;
  }

  return null;
};

export const checkStacksConnection = (): boolean => {
  return isConnected();
};
