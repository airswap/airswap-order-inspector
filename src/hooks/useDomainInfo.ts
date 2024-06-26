import { useReadContracts } from 'wagmi';
import { swapErc20Abi } from '@/abi/swapErc20Abi';
import { SwapERC20 } from '@airswap/libraries';
import { useAppStore } from '@/store/store';

/**
 *
 * @param swapContract this is inputted by a user and will override `address` obtained from `useContractAddress` hook if a user enters one
 * @returns
 */
export const useDomainInfo = ({ chainId }: { chainId: number | undefined }) => {
  const { swapContractAddress } = useAppStore();
  const address = SwapERC20.getAddress(chainId || 1);
  const _address = swapContractAddress || address;

  const wagmiContractConfig = {
    address: (swapContractAddress as `0x${string}`) || _address,
    abi: swapErc20Abi,
  };

  const { data, isLoading, error } = useReadContracts({
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
      // Immutable in contract
      staleTime: Infinity,
      gcTime: 600_000,
      enabled: !!chainId && !!_address,
    },
  });
  const [eip712Domain, protocolFee] = data || [];

  return { eip712Domain, protocolFee, isLoading, error };
};
