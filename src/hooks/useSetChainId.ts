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

export const useSetChainId = ({
  schemaValid,
  order,
}: {
  schemaValid: boolean;
  order: Order;
}): void => {
  const { setIsSelectDisabled, setSelectedChainId, selectedChainId } =
    useAppStore();

  useEffect(() => {
    if (!order?.chainId) {
      setIsSelectDisabled(false);
      return;
    } else if (schemaValid && selectedChainId !== order?.chainId) {
      setSelectedChainId(order?.chainId);
      setIsSelectDisabled(true);
    } else {
      return;
    }
  }, [
    schemaValid,
    order?.chainId,
    selectedChainId,
    setSelectedChainId,
    setIsSelectDisabled,
  ]);
};
