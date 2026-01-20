// Application configuration

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'StacksYield',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  ethereum: {
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || '',
    chainId: parseInt(process.env.NEXT_PUBLIC_ETHEREUM_CHAIN_ID || '1'),
    alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
  },
  stacks: {
    network: process.env.NEXT_PUBLIC_STACKS_NETWORK || 'mainnet',
    apiUrl: process.env.NEXT_PUBLIC_STACKS_API_URL || 'https://api.mainnet.hiro.so',
  },
  contracts: {
    usdc: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    xReserve: process.env.NEXT_PUBLIC_XRESERVE_CONTRACT_ADDRESS || '',
  },
  circle: {
    apiKey: process.env.CIRCLE_API_KEY || '',
  },
} as const;

export default config;
