import { useAppStore } from '@/store/store';
import { useEffect } from 'react';

type Order =
  | {
      nonce: number;
      signerWallet: string;
      senderWallet: string | null;
      expiry: number;
      signerToken: string;
      signerAmount: string;
      senderToken: string;
      senderAmount: string;
      v: number;
      r: string;
      s: string;
      chainId?: number | undefined;
      swapContract?: string | undefined;
      protocolFee?: number | undefined;
    }
  | undefined;

export const useSetChainId = ({ order }: { order: Order }): void => {
  const { setIsSelectDisabled, setSelectedChainId } = useAppStore();

  useEffect(() => {
    if (order?.chainId) {
      setIsSelectDisabled(true);
      setSelectedChainId(order.chainId);
    } else {
      setIsSelectDisabled(false);
    }
    return;
  }, [order?.chainId, setSelectedChainId, setIsSelectDisabled]);
};
