// Yield data fetcher for DeFi protocols
import { YieldProtocol } from '../types';
import { MOCK_PROTOCOLS } from '../constants';

/**
 * Fetch yield data from various DeFi protocols
 * In production, this would call real APIs
 */
export async function fetchYieldData(): Promise<YieldProtocol[]> {
  try {
    // TODO: Implement real API calls to protocols
    // For now, return mock data with some randomization to simulate real-time changes

    const protocols = MOCK_PROTOCOLS.map((protocol) => ({
      ...protocol,
      apy: protocol.apy + (Math.random() - 0.5) * 0.5, // Small random variation
    }));

    return protocols;
  } catch (error) {
    console.error('Error fetching yield data:', error);
    return MOCK_PROTOCOLS;
  }
}

/**
 * Get best yield opportunity
 * @param chain Filter by chain (optional)
 * @returns Protocol with highest APY
 */
export function getBestYield(
  protocols: YieldProtocol[],
  chain?: 'ethereum' | 'stacks'
): YieldProtocol | null {
  let filtered = protocols;

  if (chain) {
    filtered = protocols.filter((p) => p.chain === chain);
  }

  if (filtered.length === 0) return null;

  return filtered.reduce((best, current) =>
    current.apy > best.apy ? current : best
  );
}

/**
 * Calculate potential profit from bridging
 * @param amount Amount to bridge
 * @param currentApy Current APY on source chain
 * @param targetApy Target APY on destination chain
 * @param days Number of days to calculate for
 * @param bridgeCost Cost of bridging (in USDC)
 * @returns Potential profit
 */
export function calculateBridgeProfit(
  amount: number,
  currentApy: number,
  targetApy: number,
  days: number = 365,
  bridgeCost: number = 5
): number {
  const currentReturn = (amount * currentApy) / 100 * (days / 365);
  const targetReturn = (amount * targetApy) / 100 * (days / 365);
  const profit = targetReturn - currentReturn - bridgeCost;

  return Math.max(0, profit);
}

/**
 * Get yield recommendation based on user's position
 * @param currentChain User's current chain
 * @param amount Amount user has
 * @param protocols Available protocols
 * @returns Recommendation object
 */
export function getYieldRecommendation(
  currentChain: 'ethereum' | 'stacks',
  amount: number,
  protocols: YieldProtocol[]
) {
  const currentBest = getBestYield(protocols, currentChain);
  const otherChain = currentChain === 'ethereum' ? 'stacks' : 'ethereum';
  const otherBest = getBestYield(protocols, otherChain);

  if (!currentBest || !otherBest) {
    return null;
  }

  const profit = calculateBridgeProfit(
    amount,
    currentBest.apy,
    otherBest.apy,
    365,
    5
  );

  return {
    shouldBridge: profit > 0,
    currentProtocol: currentBest,
    recommendedProtocol: otherBest,
    potentialProfit: profit,
    apyDifference: otherBest.apy - currentBest.apy,
  };
}
