import { useAppStore } from '@/store/store';
import { useEffect } from 'react';

type Order =
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [x: string]: any;
    }
  | undefined;
// | {
//     nonce: number;
//     signerWallet: string;
//     senderWallet: string | null;
//     expiry: number;
//     signerToken: string;
//     signerAmount: string;
//     senderToken: string;
//     senderAmount: string;
//     v: number;
//     r: string;
//     s: string;
//     chainId?: number | undefined;
//     swapContract?: string | undefined;
//     protocolFee?: number | undefined;
//   }
// | undefined;

export const useSetChainId = ({
  order,
}: {
  order: Order | undefined;
}): void => {
  const { setIsSelectDisabled, setSelectedChainId } = useAppStore();

  useEffect(() => {
    if (order?.chainId) {
      setIsSelectDisabled(true);
      setSelectedChainId(order.chainId);
    } else {
      setIsSelectDisabled(false);
      setSelectedChainId(1);
    }
    return;
  }, [order?.chainId, setSelectedChainId, setIsSelectDisabled]);
};
