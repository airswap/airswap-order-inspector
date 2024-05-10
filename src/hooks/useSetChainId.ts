import { useAppStore } from '@/store/store';
import { useEffect } from 'react';

type Order =
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [x: string]: any;
    }
  | undefined;

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
