import { useAppStore } from '@/store/store';
import { useEffect } from 'react';

type Order = { [x: string]: number | string } | undefined;

export const useSetChainId = ({ order }: { order: Order }): void => {
  const { setIsSelectDisabled, setSelectedChainId } = useAppStore();

  useEffect(() => {
    if (order?.chainId) {
      setIsSelectDisabled(true);
      setSelectedChainId(Number(order.chainId));
    } else {
      setIsSelectDisabled(false);
      setSelectedChainId(1);
    }
    return;
  }, [order?.chainId, setSelectedChainId, setIsSelectDisabled]);
};
