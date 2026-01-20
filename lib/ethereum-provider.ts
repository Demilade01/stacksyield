// Ethereum blockchain provider utilities
import { ethers } from 'ethers';
import { config } from './config';

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.JsonRpcSigner | null = null;

export const initEthereumProvider = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask or compatible wallet not found');
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  return provider;
};

export const getEthereumProvider = () => {
  return provider;
};

export const getSigner = async () => {
  if (!provider) {
    await initEthereumProvider();
  }
  if (!signer && provider) {
    signer = await provider.getSigner();
  }
  return signer;
};

export const connectEthereumWallet = async (): Promise<string> => {
  try {
    if (!provider) {
      await initEthereumProvider();
    }

    if (!provider) {
      throw new Error('Provider initialization failed');
    }

    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    signer = await provider.getSigner();
    return accounts[0];
  } catch (error) {
    console.error('Error connecting Ethereum wallet:', error);
    throw error;
  }
};

export const disconnectEthereumWallet = () => {
  provider = null;
  signer = null;
};

export const getEthereumAddress = async (): Promise<string | null> => {
  try {
    if (!provider) {
      await initEthereumProvider();
    }

    if (!provider) return null;

    const accounts = await provider.send('eth_accounts', []);
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting Ethereum address:', error);
    return null;
  }
};

export const getEthereumBalance = async (address: string): Promise<string> => {
  try {
    if (!provider) {
      await initEthereumProvider();
    }

    if (!provider) {
      throw new Error('Provider not initialized');
    }

    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting Ethereum balance:', error);
    return '0';
  }
};

export const getUSDCBalance = async (address: string): Promise<string> => {
  try {
    if (!provider) {
      await initEthereumProvider();
    }

    if (!provider) {
      throw new Error('Provider not initialized');
    }

    const usdcAbi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
    ];

    const usdcContract = new ethers.Contract(
      config.contracts.usdc,
      usdcAbi,
      provider
    );

    const balance = await usdcContract.balanceOf(address);
    const decimals = await usdcContract.decimals();
    
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    return '0';
  }
};

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
