import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/wallet-context';

export function useProfile() {
  const { connected, connecting, address, disconnect, wallet } = useWallet();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for wallet to finish attempting reconnection
    if (!connecting) {
      setIsChecking(false);
      if (!connected) {
        router.push('/');
      }
    }
  }, [connected, connecting, router]);

  useEffect(() => {
    async function fetchBalance() {
      if (wallet) {
        try {
          const lovelace = await wallet.getLovelace();
          const ada = (parseInt(lovelace) / 1_000_000).toFixed(2);
          setBalance(ada);
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        }
      }
    }
    fetchBalance();
  }, [wallet]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  return {
    connected,
    connecting,
    address,
    balance,
    copied,
    isChecking,
    copyAddress,
    handleDisconnect,
  };
}
