import { SwapERC20 } from '@airswap/libraries';

export const useContractAddress = ({
  chainId = 1,
}: {
  chainId: number | undefined;
}) => {
  const address = SwapERC20.getAddress(chainId);
  return address as `0x${string}`;
};
