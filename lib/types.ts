// Core type definitions for StacksYield

export interface WalletState {
  ethereum: {
    address: string | null;
    balance: string;
    isConnected: boolean;
  };
  stacks: {
    address: string | null;
    balance: string;
    isConnected: boolean;
  };
}

export interface BridgeTransaction {
  id: string;
  from: 'ethereum' | 'stacks';
  to: 'ethereum' | 'stacks';
  amount: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash?: string;
  timestamp: number;
  estimatedTime?: number;
}

export interface YieldProtocol {
  id: string;
  name: string;
  chain: 'ethereum' | 'stacks';
  apy: number;
  tvl: string;
  logo?: string;
  description?: string;
  contractAddress?: string;
}

export interface UserPosition {
  id: string;
  protocol: YieldProtocol;
  amount: string;
  depositedAt: number;
  currentValue: string;
  earned: string;
}

export interface BridgeConfig {
  ethereumRpcUrl: string;
  stacksApiUrl: string;
  usdcAddress: string;
  xReserveAddress: string;
}

export interface ToastMessage {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
