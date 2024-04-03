import { useReadContracts } from 'wagmi';
import { swapErc20Abi } from '@/abi/swapErc20Abi';
import { useContractAddress } from './useContractAddress';

export const useDomainInfo = (chainId: number | undefined) => {
  const address = useContractAddress({ chainId });

  const wagmiContractConfig = {
    address,
    abi: swapErc20Abi,
  };

  const { data, error } = useReadContracts({
    contracts: [
      {
        ...wagmiContractConfig,
        functionName: 'eip712Domain',
      },
      {
        ...wagmiContractConfig,
        functionName: 'protocolFee',
      },
    ],
    query: {
      refetchInterval: false,
      // Once wrong, always wrong.
      staleTime: Infinity,
      gcTime: 600_000,
      enabled: !!chainId,
    },
  });
  const [eip712Domain, protocolFee] = data || [];

  console.log('error', error);

  return { eip712Domain, protocolFee };
};
