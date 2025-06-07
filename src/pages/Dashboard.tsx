import React from 'react';
import { Wallet } from 'lucide-react';
import WalletDetails from '../components/WalletDetails';
import { WalletBalanceDisplay } from '../components/WalletBalanceDisplay';

const Dashboard = () => {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Solana Wallet</h1>
          <p className="text-muted-foreground">View your Solana and WSOL balance</p>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="grid grid-cols-1 gap-6">
        <WalletBalanceDisplay />
        <WalletDetails />
      </div>
    </main>
  );
};

export default Dashboard; 