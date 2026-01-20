'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/lib/store/wallet-store';
import { toast } from 'sonner';
import { Wallet, ArrowLeftRight, LayoutDashboard, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const {
    ethereum,
    stacks,
    connectEthereum,
    connectStacks,
    disconnectEthereum,
    disconnectStacks,
    checkConnections
  } = useWalletStore();

  // Check for existing connections on mount
  useEffect(() => {
    checkConnections();
  }, [checkConnections]);

  const handleConnectEthereum = async () => {
    try {
      await connectEthereum();
      toast.success('Ethereum wallet connected');
    } catch (error) {
      toast.error('Failed to connect Ethereum wallet');
      console.error(error);
    }
  };

  const handleConnectStacks = async () => {
    try {
      await connectStacks();
      toast.success('Stacks wallet connected');
    } catch (error) {
      toast.error('Failed to connect Stacks wallet');
      console.error(error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/bridge', label: 'Bridge', icon: ArrowLeftRight },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-lg font-bold">S</span>
            </div>
            <span className="text-xl font-bold">StacksYield</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                    pathname === link.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connections */}
          <div className="flex items-center space-x-3">
            {/* Ethereum Wallet */}
            {ethereum.isConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectEthereum}
                className="hidden md:flex"
              >
                <Wallet className="mr-2 h-4 w-4" />
                ETH: {formatAddress(ethereum.address!)}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnectEthereum}
                className="hidden md:flex"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Ethereum
              </Button>
            )}

            {/* Stacks Wallet */}
            {stacks.isConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectStacks}
                className="hidden md:flex"
              >
                <Wallet className="mr-2 h-4 w-4" />
                STX: {formatAddress(stacks.address!)}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleConnectStacks}
                className="hidden md:flex"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Stacks
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
