'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserWallet } from '@meshsdk/core';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  wallet: BrowserWallet | null;
  connect: (walletName?: string) => Promise<void>;
  disconnect: () => void;
  availableWallets: Array<{ name: string; icon: string; version: string }>;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  address: null,
  wallet: null,
  connect: async () => {},
  disconnect: () => {},
  availableWallets: [],
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<BrowserWallet | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [availableWallets, setAvailableWallets] = useState<
    Array<{ name: string; icon: string; version: string }>
  >([]);

  // Get available wallets on mount
  useEffect(() => {
    const wallets = BrowserWallet.getInstalledWallets();
    setAvailableWallets(wallets);
  }, []);

  const connect = useCallback(async (walletName?: string) => {
    setConnecting(true);
    try {
      // Get list of available wallets
      const installedWallets = BrowserWallet.getInstalledWallets();

      if (installedWallets.length === 0) {
        alert('No Cardano wallet found. Please install a wallet extension (Nami, Eternl, etc.)');
        setConnecting(false);
        return;
      }

      // Connect to the first available wallet
      const selectedWalletName = installedWallets[0].name;
      const browserWallet = await BrowserWallet.enable(selectedWalletName);
      const walletAddress = (await browserWallet.getChangeAddress()).toLowerCase();

      // Secure authentication with CIP-30 direct API
      try {
        // Step 1: Request nonce from backend
        const nonceResponse = await fetch(`${API_URL}/auth/wallet/nonce`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress }),
        });

        if (!nonceResponse.ok) {
          const error = await nonceResponse.json();
          throw new Error(error.error || 'Failed to get authentication challenge');
        }

        const { nonce } = await nonceResponse.json();

        // Step 2: Sign nonce using raw CIP-30 API (not MeshSDK's broken signData)
        // Access the wallet's CIP-30 API directly
        const cardanoWallet = (window as any).cardano[selectedWalletName.toLowerCase()];
        if (!cardanoWallet) {
          throw new Error('Wallet API not available');
        }

        const api = await cardanoWallet.enable();

        // Convert nonce to hex bytes for signing
        const encoder = new TextEncoder();
        const nonceBytes = encoder.encode(nonce);
        const nonceHex = Array.from(nonceBytes)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        // Sign the nonce with CIP-30 signData
        const signedData = await api.signData(walletAddress, nonceHex);

        // Step 3: Send signature to backend for verification
        const authResponse = await fetch(`${API_URL}/auth/wallet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress,
            nonce,
            signature: signedData.signature,
            key: signedData.key,
          }),
        });

        if (!authResponse.ok) {
          const error = await authResponse.json();
          throw new Error(error.error || 'Authentication failed');
        }

        const data = await authResponse.json();

        // Store authentication token and user ID
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.user.id);

        console.log('Wallet authenticated successfully:', data.user);
      } catch (authError) {
        console.error('Failed to authenticate with backend:', authError);
        alert(
          `Authentication failed: ${authError instanceof Error ? authError.message : 'Unknown error'}`
        );
        throw authError;
      }

      setWallet(browserWallet);
      setAddress(walletAddress);
      setConnected(true);
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletName', selectedWalletName);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnected(false);
      setAddress(null);
      setWallet(null);
      // Clear localStorage on connection failure
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletName');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    setAddress(null);
    setConnected(false);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletName');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  }, []);

  // Auto-reconnect on mount if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true') {
      connect();
    } else {
      setInitializing(false);
    }
  }, [connect]);

  // Mark initialization complete after connection attempt
  useEffect(() => {
    if (!connecting && initializing) {
      setInitializing(false);
    }
  }, [connecting, initializing]);

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting: connecting || initializing,
        address,
        wallet,
        connect,
        disconnect,
        availableWallets,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
