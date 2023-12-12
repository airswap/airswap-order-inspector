import { hexToString } from 'viem';

export const getOutputErrorsList = (
  checkFunctionData: readonly [bigint, readonly `0x${string}`[]] | undefined
) => {
  return checkFunctionData?.[1].map((error: `0x${string}`) => {
    return hexToString(error);
  });
};
