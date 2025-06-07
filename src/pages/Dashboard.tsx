import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import WalletDetails from '../components/WalletDetails';
import WalletConnect from '../components/WalletConnect';
import { WalletBalanceDisplay } from '../components/WalletBalanceDisplay';

const Dashboard: React.FC = () => {
  const wallet = useSelector((state: RootState) => state.wallet);

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your wallet and bot status
          </p>
        </div>

        {!wallet.connected && (
          <div className="glass p-6 rounded-xl text-center space-y-4">
            <p className="text-muted-foreground">
              Connect your wallet to start using the sniper bot
            </p>
            <WalletConnect />
          </div>
        )}

        {wallet.connected && (
          <>
            <WalletBalanceDisplay />
            <WalletDetails />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
