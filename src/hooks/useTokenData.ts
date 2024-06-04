import { useAppStore } from '@/store/store';
import { Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

export const useTokenData = (contract: Address | undefined) => {
  const { selectedChainId } = useAppStore();

  const { data: decimals } = useReadContract({
    address: contract,
    abi: erc20Abi,
    chainId: selectedChainId || 1,
    functionName: 'decimals',
  });

  const { data: symbol } = useReadContract({
    address: contract,
    abi: erc20Abi,
    chainId: selectedChainId || 1,
    functionName: 'symbol',
  });

  return { decimals, symbol };
};
