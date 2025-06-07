import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { Wallet, Import } from 'lucide-react';
import { setConnected, setAddress, disconnect } from '../store/slices/walletSlice';
import { Button } from './ui/button';
import { useEffect, useState, useRef } from 'react';
import { PrivateKeyWalletModal } from './PrivateKeyWalletModal';
import { PrivateKeyWalletAdapter, PrivateKeyWalletName } from './PrivateKeyWalletAdapter';
import { RootState } from '../store';
import { notify } from '../lib/notifications';
import { Connection } from '@solana/web3.js';
import { SOLANA_RPC_ENDPOINT } from '../lib/solana';
import { clearTransactions } from '../lib/transactionStore';

const WalletConnect = () => {
  const { publicKey, disconnect: disconnectWallet, connected, select } = useWallet();
  const walletState = useSelector((state: RootState) => state.wallet);
  const dispatch = useDispatch();
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [myPrivateKeyAdapter] = useState(() => new PrivateKeyWalletAdapter());

  const prevConnectedRef = useRef(false);
  const prevPublicKeyRef = useRef<string | null>(null);
  const connectionErrorCountRef = useRef(0);

  const checkConnection = async () => {
    try {
      const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');
      await connection.getLatestBlockhash();
      connectionErrorCountRef.current = 0;
    } catch (error) {
      connectionErrorCountRef.current++;
      if (connectionErrorCountRef.current >= 3 && connectionErrorCountRef.current % 3 === 0) {
        notify({
          type: 'error',
          message: 'Having difficulty connecting to Solana network. Please try again later.',
        });
      }
    }
  };

  useEffect(() => {
    const currentPublicKeyStr = publicKey ? publicKey.toString() : null;

    if (myPrivateKeyAdapter.connected && myPrivateKeyAdapter.publicKey) {
      const adapterPublicKeyStr = myPrivateKeyAdapter.publicKey.toString();

      if (!prevConnectedRef.current || prevPublicKeyRef.current !== adapterPublicKeyStr) {
        dispatch(setConnected(true));
        dispatch(setAddress(adapterPublicKeyStr));
        prevConnectedRef.current = true;
        prevPublicKeyRef.current = adapterPublicKeyStr;
        checkConnection();
        return;
      }
    }

    if (connected && publicKey &&
      (prevConnectedRef.current !== connected ||
        prevPublicKeyRef.current !== currentPublicKeyStr)) {
      dispatch(setConnected(true));
      dispatch(setAddress(currentPublicKeyStr));
      prevConnectedRef.current = connected;
      prevPublicKeyRef.current = currentPublicKeyStr;
      checkConnection();
    } else if (!connected && !myPrivateKeyAdapter.connected && prevConnectedRef.current) {
      dispatch(disconnect());
      prevConnectedRef.current = false;
      prevPublicKeyRef.current = null;
    }
  }, [connected, publicKey, dispatch, myPrivateKeyAdapter]);

  const handleConnectClick = () => {
    if (connected || myPrivateKeyAdapter.connected) {
      clearTransactions();
      if (connected) disconnectWallet();
      if (myPrivateKeyAdapter.connected) myPrivateKeyAdapter.disconnect();
      dispatch(disconnect());
      prevConnectedRef.current = false;
      prevPublicKeyRef.current = null;
    } else {
      setShowPrivateKeyModal(true);
    }
  };

  const handleConnectWithPrivateKey = async (privateKey: string): Promise<void> => {
    try {
      setIsConnecting(true);
      await myPrivateKeyAdapter.connect(privateKey);

      if (myPrivateKeyAdapter.publicKey) {
        const publicKeyStr = myPrivateKeyAdapter.publicKey.toString();
        dispatch(setConnected(true));
        dispatch(setAddress(publicKeyStr));
        prevConnectedRef.current = true;
        prevPublicKeyRef.current = publicKeyStr;
        select(PrivateKeyWalletName);
        await checkConnection();
      }
    } catch (error) {
      console.error('WalletConnect: Failed to connect with private key:', error);
      notify({
        type: 'error',
        message: 'Could not connect wallet with this private key. Please check and try again.',
      });
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const isWalletConnected = connected || myPrivateKeyAdapter.connected;
  const currentPublicKey = publicKey || myPrivateKeyAdapter.publicKey;

  return (
    <div className="flex items-center">
      <Button
        onClick={handleConnectClick}
        variant={isWalletConnected ? 'outline' : 'default'}
        className={
          isWalletConnected
            ? 'glass hover:bg-primary/10'
            : 'glass bg-gradient-to-r from-primary/90 to-primary hover:opacity-90 transition-all shadow-lg scale-100 hover:scale-105'
        }
        size="sm"
        disabled={isConnecting}
      >
        {isWalletConnected ? (
          <Wallet className="w-4 h-4 mr-2" />
        ) : (
          <Import className="w-4 h-4 mr-2" />
        )}

        {isWalletConnected && currentPublicKey ? (
          <span className="font-mono">
            {currentPublicKey.toString().slice(0, 4)}...
            {currentPublicKey.toString().slice(-4)}
          </span>
        ) : isConnecting ? (
          'Connecting...'
        ) : (
          'Connect Wallet'
        )}
      </Button>

      <PrivateKeyWalletModal
        isOpen={showPrivateKeyModal}
        onClose={() => setShowPrivateKeyModal(false)}
        onConnect={handleConnectWithPrivateKey}
      />
    </div>
  );
};

export default WalletConnect;
