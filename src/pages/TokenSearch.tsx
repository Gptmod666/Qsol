import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { getTokenInfo, TokenInfo } from '../lib/tokenService';

const TokenSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [token, setToken] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const info = await getTokenInfo(query.trim());
      if (info) {
        setToken(info);
      } else {
        setToken(null);
        setError('Token not found');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch token info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-4 md:p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">Token Search</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Lookup token details by address</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Enter token address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading || !query}>
            Search
          </Button>
        </div>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {token && (
          <div className="glass rounded-xl p-4 space-y-2">
            <div className="font-semibold text-lg">{token.name} ({token.symbol})</div>
            <div className="text-sm text-muted-foreground break-words">{token.address}</div>
            <div className="text-sm">Decimals: {token.decimals}</div>
            <div className="text-sm">Total Supply: {token.totalSupply.toLocaleString()}</div>
            {token.price !== undefined && (
              <div className="text-sm">Price: ${token.price.toFixed(4)}</div>
            )}
            {token.marketcap !== undefined && (
              <div className="text-sm">Market Cap: ${token.marketcap.toLocaleString()}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenSearch;
