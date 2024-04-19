import { chainIdOptions } from '@/lib/chainIdOptions';

export const chainIdInOptions = (chainId: number): boolean => {
  return chainIdOptions.some((option) => option.value === chainId.toString());
};
