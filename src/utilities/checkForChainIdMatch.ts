import { chainIdOptions } from './chainIdOptions';

export const checkForChainIdMatch = (
  chainIdFromJson: string | number | undefined
): boolean => {
  if (isNaN(Number(chainIdFromJson))) {
    return false;
  }
  return chainIdOptions.some(
    (option) => option.value === chainIdFromJson?.toString()
  );
};
