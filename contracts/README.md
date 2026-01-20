# StacksYield Smart Contracts

## Yield Vault Contract (`yield-vault.clar`)

This Clarity smart contract manages USDCx deposits and tracks yield across different DeFi protocols on Stacks.

### Features

- **Deposit Tracking**: Records user deposits and assigns them to specific protocols
- **Yield Calculation**: Calculates estimated yields based on time and APY
- **TVL Management**: Tracks total value locked across all protocols
- **Protocol Stats**: Maintains stats for each integrated protocol
- **Pausable**: Contract can be paused by owner for emergency situations

### Functions

#### Read-Only Functions

- `get-user-position`: Get a user's current position
- `get-protocol-stats`: Get statistics for a specific protocol
- `get-total-tvl`: Get total value locked in the contract
- `is-paused`: Check if contract is paused
- `calculate-yield`: Calculate estimated yield for a user

#### Public Functions

- `deposit`: Deposit USDCx into a specific protocol
- `withdraw`: Withdraw USDCx from your position

#### Admin Functions

- `pause-contract`: Pause the contract (owner only)
- `unpause-contract`: Unpause the contract (owner only)
- `update-protocol-apy`: Update APY for a protocol (owner only)

### Deployment

#### Testnet Deployment

```bash
# Install Clarinet
curl -L https://get.clarinet.sh | sh

# Check contract syntax
clarinet check

# Test contract
clarinet test

# Deploy to testnet
clarinet deploy --testnet
```

#### Mainnet Deployment

```bash
clarinet deploy --mainnet
```

### Testing

Run the test suite:

```bash
clarinet test
```

### Integration

To integrate this contract in your frontend:

```typescript
import { openContractCall } from '@stacks/connect';
import { uintCV, stringAsciiCV } from '@stacks/transactions';

// Deposit example
await openContractCall({
  contractAddress: 'ST...', // Contract address
  contractName: 'yield-vault',
  functionName: 'deposit',
  functionArgs: [
    uintCV(1000000), // Amount in micro-units
    stringAsciiCV('alex-lending'), // Protocol ID
  ],
  onFinish: (data) => {
    console.log('Transaction ID:', data.txId);
  },
});
```

### Security Considerations

- Contract includes pause functionality for emergency situations
- All public functions validate inputs
- Owner-only functions are protected
- TVL and user positions are tracked separately to prevent inconsistencies

### Future Improvements

- [ ] Implement auto-compounding
- [ ] Add multi-protocol rebalancing
- [ ] Integrate with more DeFi protocols
- [ ] Add referral system
- [ ] Implement governance for APY updates
