// Application constants

export const CHAINS = {
  ETHEREUM: {
    id: 1,
    name: 'Ethereum',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || '',
    explorerUrl: 'https://etherscan.io',
  },
  STACKS: {
    name: 'Stacks',
    apiUrl: process.env.NEXT_PUBLIC_STACKS_API_URL || 'https://api.mainnet.hiro.so',
    explorerUrl: 'https://explorer.stacks.co',
  },
} as const;

export const CONTRACTS = {
  USDC: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  XRESERVE: process.env.NEXT_PUBLIC_XRESERVE_CONTRACT_ADDRESS || '',
} as const;

export const BRIDGE_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const SUPPORTED_WALLETS = {
  ETHEREUM: ['MetaMask', 'WalletConnect'],
  STACKS: ['Leather', 'Xverse'],
} as const;

// Mock yield protocols for initial development
export const MOCK_PROTOCOLS = [
  {
    id: 'alex-lending',
    name: 'ALEX Lending',
    chain: 'stacks' as const,
    apy: 8.5,
    tvl: '2.5M',
    logo: '/protocols/alex.png',
    description: 'Decentralized lending protocol on Stacks',
  },
  {
    id: 'arkadiko-vault',
    name: 'Arkadiko Vault',
    chain: 'stacks' as const,
    apy: 7.2,
    tvl: '1.8M',
    logo: '/protocols/arkadiko.png',
    description: 'Stablecoin vaults with competitive yields',
  },
  {
    id: 'velar-pool',
    name: 'Velar Liquidity Pool',
    chain: 'stacks' as const,
    apy: 9.8,
    tvl: '3.2M',
    logo: '/protocols/velar.png',
    description: 'AMM liquidity pools',
  },
  {
    id: 'aave-eth',
    name: 'Aave V3',
    chain: 'ethereum' as const,
    apy: 4.5,
    tvl: '1.2B',
    logo: '/protocols/aave.png',
    description: 'Leading DeFi lending protocol',
  },
  {
    id: 'compound-eth',
    name: 'Compound Finance',
    chain: 'ethereum' as const,
    apy: 3.8,
    tvl: '850M',
    logo: '/protocols/compound.png',
    description: 'Autonomous interest rate protocol',
  },
];

export const ROUTE_PATHS = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  BRIDGE: '/bridge',
  PORTFOLIO: '/portfolio',
} as const;
