'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { YieldProtocol } from '@/lib/types';

export default function HomePage() {
  const { data: yieldsData } = useQuery({
    queryKey: ['yields'],
    queryFn: async () => {
      const res = await fetch('/api/yields');
      return res.json();
    },
  });

  const yields: YieldProtocol[] = yieldsData?.data || [];
  const stacksBest = yields
    .filter((y) => y.chain === 'stacks')
    .sort((a, b) => b.apy - a.apy)[0];
  const ethBest = yields
    .filter((y) => y.chain === 'ethereum')
    .sort((a, b) => b.apy - a.apy)[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-background -z-10" />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Maximize Your USDC Yields
              <span className="block text-primary mt-2">Across Chains</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare DeFi yields between Ethereum and Stacks in real-time.
              Bridge your USDC seamlessly and start earning more today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/bridge">
                <Button size="lg" variant="outline" className="text-lg">
                  Bridge Now
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            {stacksBest && ethBest && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-12">
                <Card className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Best Stacks APY</div>
                  <div className="text-3xl font-bold text-primary">{stacksBest.apy.toFixed(2)}%</div>
                  <div className="text-sm text-muted-foreground mt-1">{stacksBest.name}</div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Best Ethereum APY</div>
                  <div className="text-3xl font-bold">{ethBest.apy.toFixed(2)}%</div>
                  <div className="text-sm text-muted-foreground mt-1">{ethBest.name}</div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why StacksYield?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The most efficient way to maximize your stablecoin returns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Yields</h3>
              <p className="text-muted-foreground">
                Compare real-time yields across multiple protocols on Ethereum and Stacks to find the best rates.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seamless Bridging</h3>
              <p className="text-muted-foreground">
                Bridge USDC between Ethereum and Stacks effortlessly using Circle's xReserve protocol.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Transparent</h3>
              <p className="text-muted-foreground">
                All transactions are on-chain and auditable. Your funds, your control.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start earning more on your USDC
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Connect Wallets',
                description: 'Connect both your Ethereum and Stacks wallets to get started.',
              },
              {
                step: '2',
                title: 'Compare Yields',
                description: 'View real-time yield comparisons across DeFi protocols on both chains.',
              },
              {
                step: '3',
                title: 'Bridge & Earn',
                description: 'Bridge to the best opportunity and start earning higher yields.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Maximize Your Yields?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join StacksYield today and unlock the full potential of cross-chain DeFi
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg">
              Launch App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
