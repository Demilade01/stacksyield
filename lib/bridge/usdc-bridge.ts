// USDCx Bridge integration with Circle xReserve
import { ethers } from 'ethers';
import { getSigner } from '../ethereum-provider';
import { config } from '../config';
import { BridgeTransaction } from '../types';

// Circle xReserve ABI (simplified - add full ABI for production)
const XRESERVE_ABI = [
  'function deposit(address token, uint256 amount, bytes32 destinationChain, bytes32 destinationAddress) external',
  'function withdraw(bytes32 sourceChain, bytes32 sourceAddress, uint256 amount, bytes proof) external',
  'event Deposit(address indexed sender, address indexed token, uint256 amount, bytes32 destinationChain)',
  'event Withdrawal(address indexed recipient, uint256 amount, bytes32 sourceChain)',
];

const USDC_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address owner) external view returns (uint256)',
];

/**
 * Bridge USDC from Ethereum to Stacks
 * @param amount Amount of USDC to bridge (in human-readable format, e.g., "100")
 * @param stacksAddress Destination Stacks address
 * @returns Transaction hash
 */
export async function bridgeToStacks(
  amount: string,
  stacksAddress: string
): Promise<string> {
  try {
    const signer = await getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    // Convert amount to wei (USDC has 6 decimals)
    const amountWei = ethers.parseUnits(amount, 6);

    // Initialize USDC contract
    const usdcContract = new ethers.Contract(
      config.contracts.usdc,
      USDC_ABI,
      signer
    );

    // Check allowance
    const signerAddress = await signer.getAddress();
    const allowance = await usdcContract.allowance(
      signerAddress,
      config.contracts.xReserve
    );

    // Approve if needed
    if (allowance < amountWei) {
      console.log('Approving USDC spend...');
      const approveTx = await usdcContract.approve(
        config.contracts.xReserve,
        amountWei
      );
      await approveTx.wait();
      console.log('USDC approved');
    }

    // Initialize xReserve contract
    const xReserveContract = new ethers.Contract(
      config.contracts.xReserve,
      XRESERVE_ABI,
      signer
    );

    // Convert Stacks address to bytes32
    const stacksAddressBytes = ethers.encodeBytes32String(stacksAddress);
    const stacksChainId = ethers.encodeBytes32String('stacks');

    // Execute bridge transaction
    console.log('Initiating bridge to Stacks...');
    const tx = await xReserveContract.deposit(
      config.contracts.usdc,
      amountWei,
      stacksChainId,
      stacksAddressBytes
    );

    console.log('Bridge transaction submitted:', tx.hash);

    // Wait for confirmation
    await tx.wait();
    console.log('Bridge transaction confirmed');

    return tx.hash;
  } catch (error) {
    console.error('Error bridging to Stacks:', error);
    throw error;
  }
}

/**
 * Bridge USDCx from Stacks to Ethereum
 * @param amount Amount of USDCx to bridge
 * @param ethereumAddress Destination Ethereum address
 * @returns Transaction ID
 */
export async function bridgeToEthereum(
  amount: string,
  ethereumAddress: string
): Promise<string> {
  try {
    // TODO: Implement Stacks -> Ethereum bridge
    // This requires:
    // 1. Burn USDCx on Stacks
    // 2. Get attestation from Circle
    // 3. Claim USDC on Ethereum

    console.log('Bridging to Ethereum:', { amount, ethereumAddress });

    // Placeholder implementation
    throw new Error('Stacks to Ethereum bridge not yet implemented');
  } catch (error) {
    console.error('Error bridging to Ethereum:', error);
    throw error;
  }
}

/**
 * Check bridge transaction status
 * @param txHash Transaction hash
 * @returns Transaction status
 */
export async function checkBridgeStatus(
  txHash: string
): Promise<BridgeTransaction['status']> {
  try {
    // TODO: Implement status checking via Circle API or blockchain
    // For now, return mock status
    console.log('Checking bridge status for:', txHash);
    return 'completed';
  } catch (error) {
    console.error('Error checking bridge status:', error);
    return 'failed';
  }
}

/**
 * Estimate bridge time
 * @param from Source chain
 * @param to Destination chain
 * @returns Estimated time in seconds
 */
export function estimateBridgeTime(
  from: 'ethereum' | 'stacks',
  to: 'ethereum' | 'stacks'
): number {
  // Ethereum -> Stacks typically takes 10-15 minutes
  if (from === 'ethereum' && to === 'stacks') {
    return 12 * 60; // 12 minutes in seconds
  }

  // Stacks -> Ethereum typically takes 15-20 minutes
  if (from === 'stacks' && to === 'ethereum') {
    return 18 * 60; // 18 minutes in seconds
  }

  return 0;
}
