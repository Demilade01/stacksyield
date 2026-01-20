'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWalletStore } from '@/lib/store/wallet-store';
import { useBridgeStore } from '@/lib/store/bridge-store';
import { bridgeToStacks, estimateBridgeTime } from '@/lib/bridge/usdc-bridge';
import { toast } from 'sonner';
import { ArrowDown, ArrowRight, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function BridgePage() {
  const { ethereum, stacks } = useWalletStore();
  const { currentTransaction, addTransaction, updateTransaction } = useBridgeStore();

  const [fromChain, setFromChain] = useState<'ethereum' | 'stacks'>('ethereum');
  const [toChain, setToChain] = useState<'ethereum' | 'stacks'>('stacks');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSwapChains = () => {
    setFromChain(toChain);
    setToChain(fromChain);
  };

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (fromChain === 'ethereum' && !ethereum.isConnected) {
      toast.error('Please connect your Ethereum wallet');
      return;
    }

    if (toChain === 'stacks' && !stacks.isConnected) {
      toast.error('Please connect your Stacks wallet');
      return;
    }

    setIsLoading(true);

    try {
      const transaction = {
        id: Date.now().toString(),
        from: fromChain,
        to: toChain,
        amount,
        status: 'pending' as const,
        timestamp: Date.now(),
        estimatedTime: estimateBridgeTime(fromChain, toChain),
      };

      addTransaction(transaction);

      if (fromChain === 'ethereum' && toChain === 'stacks') {
        toast.info('Initiating bridge transaction...');

        const txHash = await bridgeToStacks(amount, stacks.address!);

        updateTransaction(transaction.id, {
          status: 'processing',
          txHash,
        });

        toast.success('Bridge transaction submitted!', {
          description: `Transaction hash: ${txHash.slice(0, 10)}...`,
        });

        // Simulate completion (in production, monitor actual status)
        setTimeout(() => {
          updateTransaction(transaction.id, { status: 'completed' });
          toast.success('Bridge completed!', {
            description: `${amount} USDCx received on Stacks`,
          });
        }, 5000);

      } else {
        toast.error('Stacks to Ethereum bridge coming soon!');
        updateTransaction(transaction.id, { status: 'failed' });
      }

    } catch (error: any) {
      console.error('Bridge error:', error);
      toast.error('Bridge failed', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fromBalance = fromChain === 'ethereum' ? ethereum.balance : stacks.balance;
  const canBridge = parseFloat(amount) > 0 && parseFloat(fromBalance) >= parseFloat(amount || '0');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Bridge USDC</h1>
          <p className="text-muted-foreground">
            Transfer USDC between Ethereum and Stacks seamlessly
          </p>
        </div>

        <Card className="p-8">
          {/* From Section */}
          <div className="space-y-4">
            <Label htmlFor="from">From</Label>
            <Select
              value={fromChain}
              onValueChange={(value) => setFromChain(value as 'ethereum' | 'stacks')}
            >
              <SelectTrigger id="from">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="stacks">Stacks</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label htmlFor="amount">Amount</Label>
                <span className="text-muted-foreground">
                  Balance: {fromBalance} USDC
                </span>
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAmount(fromBalance)}
                className="text-xs"
              >
                Max
              </Button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapChains}
              className="rounded-full"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Section */}
          <div className="space-y-4">
            <Label htmlFor="to">To</Label>
            <Select
              value={toChain}
              onValueChange={(value) => setToChain(value as 'ethereum' | 'stacks')}
            >
              <SelectTrigger id="to">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="stacks">Stacks</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Label>You'll receive</Label>
              <div className="text-2xl font-bold">
                {amount || '0.00'} {toChain === 'ethereum' ? 'USDC' : 'USDCx'}
              </div>
            </div>
          </div>

          {/* Bridge Info */}
          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated time</span>
              <span className="font-medium">
                {Math.round(estimateBridgeTime(fromChain, toChain) / 60)} minutes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bridge fee</span>
              <span className="font-medium">~$5</span>
            </div>
          </div>

          {/* Bridge Button */}
          <Button
            className="w-full mt-6"
            size="lg"
            onClick={handleBridge}
            disabled={!canBridge || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bridging...
              </>
            ) : (
              <>
                Bridge Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Wallet Connection Warnings */}
          {!ethereum.isConnected && fromChain === 'ethereum' && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Please connect your Ethereum wallet to continue
            </p>
          )}
          {!stacks.isConnected && toChain === 'stacks' && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Please connect your Stacks wallet to continue
            </p>
          )}
        </Card>

        {/* Current Transaction Status */}
        {currentTransaction && currentTransaction.status !== 'completed' && currentTransaction.status !== 'failed' && (
          <Card className="p-6 mt-6">
            <h3 className="font-semibold mb-4">Bridge in Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Amount</span>
                <span className="font-medium">{currentTransaction.amount} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>From</span>
                <span className="font-medium capitalize">{currentTransaction.from}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>To</span>
                <span className="font-medium capitalize">{currentTransaction.to}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status</span>
                <span className="font-medium capitalize">{currentTransaction.status}</span>
              </div>

              <Progress value={currentTransaction.status === 'processing' ? 50 : 25} />

              {currentTransaction.txHash && (
                <a
                  href={`https://etherscan.io/tx/${currentTransaction.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline block"
                >
                  View on Etherscan →
                </a>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
