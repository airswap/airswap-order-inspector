import { chainIdOptions } from '@/lib/chainIdOptions';

export const matchNetworkNameWithId = (chainId: string) => {
  const foundOption = chainIdOptions.find((option) => option.value === chainId);
  return foundOption ? foundOption.label : null;
};
