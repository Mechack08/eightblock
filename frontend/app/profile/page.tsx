'use client';

import { Button } from '@/components/ui/button';
import { LogOut, Edit } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { userArticles } from '@/lib/mock-data';
import { WalletCard } from '@/components/profile/WalletCard';
import { ArticleCard } from '@/components/profile/ArticleCard';
import { EmptyState } from '@/components/profile/EmptyState';
import { LoadingState } from '@/components/profile/LoadingState';

export default function ProfilePage() {
  const {
    connected,
    connecting,
    address,
    balance,
    copied,
    isChecking,
    copyAddress,
    handleDisconnect,
  } = useProfile();

  // Show loading state while checking wallet connection
  if (isChecking || connecting) {
    return <LoadingState />;
  }

  if (!connected || !address) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header with Wallet Info */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#080808]">My Profile</h1>
            <p className="mt-2 text-gray-600">Manage your wallet and articles</p>
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>

        <WalletCard
          address={address}
          balance={balance}
          copied={copied}
          onCopyAddress={copyAddress}
        />
      </div>

      {/* Articles Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#080808]">My Articles</h2>
          <Button className="bg-[#080808] text-white hover:bg-gray-800">
            <Edit className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </div>

        <div className="space-y-4">
          {userArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {userArticles.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}
