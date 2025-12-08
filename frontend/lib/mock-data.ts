export interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  status: 'published' | 'draft';
  views: number;
}

export const userArticles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with Cardano Smart Contracts',
    description:
      'A comprehensive guide to building your first smart contract on Cardano using Plutus.',
    category: 'Blockchain',
    date: 'Nov 28, 2024',
    status: 'published',
    views: 1243,
  },
  {
    id: '2',
    title: 'Understanding ADA Staking Rewards',
    description:
      'Learn how staking works on Cardano and maximize your rewards with these strategies.',
    category: 'DeFi',
    date: 'Dec 2, 2024',
    status: 'published',
    views: 892,
  },
  {
    id: '3',
    title: 'Building NFT Marketplace on Cardano',
    description: 'Step-by-step tutorial for creating an NFT marketplace using Cardano blockchain.',
    category: 'NFT',
    date: 'Dec 5, 2024',
    status: 'draft',
    views: 0,
  },
];
