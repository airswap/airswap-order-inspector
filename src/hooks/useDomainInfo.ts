import { useReadContracts } from 'wagmi';
import { swapErc20Abi } from '@/abi/swapErc20Abi';
import { useContractAddress } from './useContractAddress';

export const useDomainInfo = ({
  isEnabled = false,
  chainId,
}: {
  isEnabled: boolean;
  chainId: number | undefined;
}) => {
  const address = useContractAddress({ chainId });

  const wagmiContractConfig = {
    address,
    abi: swapErc20Abi,
  };

  const { data, error, isPending } = useReadContracts({
    contracts: [
      {
        ...wagmiContractConfig,
        functionName: 'eip712Domain',
      },
      {
        ...wagmiContractConfig,
        functionName: 'DOMAIN_CHAIN_ID',
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
      enabled: isEnabled,
    },
  });
  const [eip712Domain, domainChainId, protocolFee] = data || [];

  return { eip712Domain, domainChainId, protocolFee };
};
