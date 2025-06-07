import React from 'react';
import { useMarketData } from '../lib/marketData';

const Market: React.FC = () => {
  const { tokens, loading, error } = useMarketData();

  return (
    <div className="flex-1 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">Market Overview</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Top Solana tokens by volume</p>
        </div>
        <div className="glass rounded-xl overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-3 py-2">Token</th>
                <th className="px-3 py-2 text-right">Price</th>
                <th className="px-3 py-2 text-right">24h %</th>
                <th className="px-3 py-2 text-right">24h Volume</th>
                <th className="px-3 py-2 text-right">Liquidity</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => (
                <tr key={t.address} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="font-medium">{t.symbol}</div>
                    <div className="text-muted-foreground text-xs">{t.name}</div>
                  </td>
                  <td className="px-3 py-2 text-right">${parseFloat(t.priceUsd).toFixed(4)}</td>
                  <td
                    className={`px-3 py-2 text-right ${t.priceChange?.h24 >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {t.priceChange?.h24 >= 0 ? '+' : ''}{t.priceChange?.h24.toFixed(2)}%
                  </td>
                  <td className="px-3 py-2 text-right">${(t.volume?.h24 || 0).toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">${(t.liquidity?.usd || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tokens.length === 0 && !loading && (
            <div className="p-4 text-center text-muted-foreground">No data</div>
          )}
        </div>
        {loading && <div className="text-center py-6">Loading...</div>}
        {error && <div className="text-center text-red-500 py-6">{error}</div>}
      </div>
    </div>
  );
};

export default Market;
