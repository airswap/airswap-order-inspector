import { useReadContracts } from 'wagmi';
import { swapErc20Abi } from '@/abi/swapErc20Abi';
import { useContractAddress } from './useContractAddress';

/**
 *
 * @param swapContract this is inputted by a user and will override `address` obtained from `useContractAddress` hook if a user enters one
 * @returns
 */
export const useDomainInfo = ({
  chainId,
  swapContract,
}: {
  chainId: number | undefined;
  swapContract: string | undefined;
}) => {
  const address = useContractAddress({ chainId });
  const wagmiContractConfig = {
    address: (swapContract as `0x${string}`) || address,
    abi: swapErc20Abi,
  };

  const { data } = useReadContracts({
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

  return { eip712Domain, protocolFee };
};
