'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/lib/store/wallet-store';
import { useQuery } from '@tanstack/react-query';
import { YieldProtocol } from '@/lib/types';
import { ArrowRight, TrendingUp, Wallet } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const { ethereum, stacks } = useWalletStore();

  const { data: yieldsData, isLoading } = useQuery({
    queryKey: ['yields'],
    queryFn: async () => {
      const res = await fetch('/api/yields');
      return res.json();
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const yields: YieldProtocol[] = yieldsData?.data || [];
  const stacksYields = yields.filter((y) => y.chain === 'stacks');
  const ethYields = yields.filter((y) => y.chain === 'ethereum');

  const totalBalance = parseFloat(ethereum.balance) + parseFloat(stacks.balance);

  // Mock projected earnings (in production, calculate based on real positions)
  const projectedYearly = totalBalance * 0.085; // Assuming 8.5% average APY
  const projectedMonthly = projectedYearly / 12;

  // Get best opportunities
  const bestStacksYield = stacksYields.sort((a, b) => b.apy - a.apy)[0];
  const bestEthYield = ethYields.sort((a, b) => b.apy - a.apy)[0];

  // Calculate potential profit from bridging
  const potentialProfit = bestStacksYield && bestEthYield
    ? (bestStacksYield.apy - bestEthYield.apy) * totalBalance / 100
    : 0;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your yields and compare opportunities across chains
        </p>
      </div>

      {/* Wallet Status */}
      {(!ethereum.isConnected || !stacks.isConnected) && (
        <Card className="p-6 mb-8 border-primary/50 bg-primary/5">
          <div className="flex items-start space-x-4">
            <Wallet className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Connect Your Wallets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect both wallets to access all features and start earning
              </p>
              <div className="flex gap-3">
                {!ethereum.isConnected && (
                  <Button size="sm" variant="outline">
                    Connect Ethereum
                  </Button>
                )}
                {!stacks.isConnected && (
                  <Button size="sm">
                    Connect Stacks
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Balance</div>
          <div className="text-3xl font-bold mb-1">${totalBalance.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">USDC across chains</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Projected Monthly</div>
          <div className="text-3xl font-bold text-primary mb-1">
            ${projectedMonthly.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Based on current APY</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Projected Yearly</div>
          <div className="text-3xl font-bold text-primary mb-1">
            ${projectedYearly.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Estimated earnings</div>
        </Card>
      </div>

      {/* Chain Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold mb-1">Ethereum</h3>
              <p className="text-sm text-muted-foreground">Mainnet</p>
            </div>
            <Badge variant="outline">ETH</Badge>
          </div>
          <div className="text-2xl font-bold mb-2">{ethereum.balance} USDC</div>
          {ethereum.isConnected && (
            <p className="text-xs text-muted-foreground">
              {ethereum.address?.slice(0, 10)}...{ethereum.address?.slice(-8)}
            </p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold mb-1">Stacks</h3>
              <p className="text-sm text-muted-foreground">Mainnet</p>
            </div>
            <Badge variant="outline">STX</Badge>
          </div>
          <div className="text-2xl font-bold mb-2">{stacks.balance} USDCx</div>
          {stacks.isConnected && (
            <p className="text-xs text-muted-foreground">
              {stacks.address?.slice(0, 10)}...{stacks.address?.slice(-8)}
            </p>
          )}
        </Card>
      </div>

      {/* Smart Recommendation */}
      {potentialProfit > 0 && totalBalance > 0 && (
        <Card className="p-6 mb-8 border-primary/50 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Smart Recommendation</h3>
              </div>
              <p className="text-sm mb-4">
                Bridge your USDC to Stacks to earn{' '}
                <span className="font-semibold text-primary">
                  {((bestStacksYield.apy - bestEthYield.apy)).toFixed(2)}% more APY
                </span>
                . That's an extra{' '}
                <span className="font-semibold">${potentialProfit.toFixed(2)}/year</span>!
              </p>
              <Link href="/bridge">
                <Button>
                  Bridge Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Yield Comparison */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Available Yields</h2>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Chains</TabsTrigger>
            <TabsTrigger value="stacks">Stacks Only</TabsTrigger>
            <TabsTrigger value="ethereum">Ethereum Only</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <YieldTable yields={yields} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="stacks">
            <YieldTable yields={stacksYields} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="ethereum">
            <YieldTable yields={ethYields} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function YieldTable({ yields, isLoading }: { yields: YieldProtocol[]; isLoading: boolean }) {
  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading yields...</div>;
  }

  if (yields.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No yields available</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocol</TableHead>
          <TableHead>Chain</TableHead>
          <TableHead className="text-right">APY</TableHead>
          <TableHead className="text-right">TVL</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {yields.map((protocol) => (
          <TableRow key={protocol.id}>
            <TableCell className="font-medium">{protocol.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {protocol.chain}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <span className="font-semibold text-primary">
                {protocol.apy.toFixed(2)}%
              </span>
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              ${protocol.tvl}
            </TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="outline">
                Deposit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
