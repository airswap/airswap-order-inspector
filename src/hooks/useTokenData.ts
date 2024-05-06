import { Address, erc20Abi } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

export const useTokenData = (contract: Address | undefined) => {
  const chainId = useChainId();

  const { data: decimals } = useReadContract({
    address: contract,
    abi: erc20Abi,
    chainId: chainId,
    functionName: 'decimals',
  });

  const { data: symbol } = useReadContract({
    address: contract,
    abi: erc20Abi,
    chainId: chainId,
    functionName: 'symbol',
  });

  return { decimals, symbol };
};
