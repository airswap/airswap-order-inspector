/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Address, Hash, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { swapErc20Abi } from '../abi/swapErc20Abi';
import { SignedOrder } from '../utils/orderSchema';
import { ChainStore, useChainStore } from '@/store/store';

export const useCheckOrder = ({
  swapContract,
  enabled = true,
  order,
}: {
  swapContract: Address;
  enabled?: boolean;
  order?: SignedOrder;
}) => {
  const selectedChainId = useChainStore(
    (state: ChainStore) => state.selectedChainId
  );

  return useReadContract({
    address: swapContract,
    chainId: selectedChainId,
    abi: swapErc20Abi,
    functionName: 'check',
    args: [
      // Note that we can safely assert non-null here as we will not enable the
      (order?.senderWallet! as Address) || zeroAddress,
      BigInt(order?.nonce || 0),
      BigInt(order?.expiry || 0),
      order?.signerWallet! as Address,
      order?.signerToken! as Address,
      BigInt(order?.signerAmount! || 0),
      order?.senderToken! as Address,
      BigInt(order?.senderAmount! || 0),
      order?.v!,
      order?.r! as Hash,
      order?.s! as Hash,
    ],

    query: {
      refetchInterval: false,
      // Once wrong, always wrong.
      staleTime: Infinity,
      gcTime: 600_000,
      enabled: !!order && enabled,
    },
  });
};
