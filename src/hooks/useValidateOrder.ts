import { hexToString } from 'viem';
import { useCheckOrder } from './useCheckOrder';
import { signedOrderSchema } from '../utils/orderSchema';
import { parseOrderFromUrl } from '../utils/parseOrderFromUrl';
import {
  ChainStore,
  SwapContractAddressStore,
  useChainStore,
  useSelectStore,
  useSwapContractAddressStore,
} from '@/store/store';
import { SelectStore } from '@/store/store';

export const useValidateOrder = ({
  order,
  isUrl,
  swapContract,
  onSetChain,
}: {
  order?: string;
  isUrl: boolean;
  swapContract: string | undefined;
  onSetChain?: (chainId: number) => void;
}) => {
  const setIsSelectDisabled = useSelectStore(
    (state: SelectStore) => state.setIsSelectDisabled
  );
  const selectedChainId = useChainStore(
    (state: ChainStore) => state.selectedChainId
  );
  const setSwapContractAddress = useSwapContractAddressStore(
    (state: SwapContractAddressStore) => state.setSwapContractAddress
  );

  let _order;
  let orderParsingError;
  if (order) {
    try {
      _order = isUrl ? parseOrderFromUrl(order) : JSON.parse(order);
    } catch (e) {
      orderParsingError = e;
    }
  }

  const schemaValidationResult = signedOrderSchema.safeParse(_order);

  const schemaValid = schemaValidationResult.success;

  // if schema contains a chainId, set set `setSelectedChainId` with that. `setSelectedChainId` lives in the chain Store
  if (schemaValid && schemaValidationResult.data.chainId) {
    const chainId = schemaValidationResult.data.chainId;
    // if chainId is present, disable the selector
    setIsSelectDisabled(true);
    onSetChain?.(chainId);
  } else {
    // if scheme does not contain chainId, enable the selector
    setIsSelectDisabled(false);
  }

  // if swapContractAddress is present, we want to pass it into the store, then into `usecontractAddress` hook to set eip721domain info
  if (schemaValid && schemaValidationResult.data.swapContract) {
    const contractAddress = schemaValidationResult.data.swapContract;
    setSwapContractAddress(contractAddress);
  }

  const { data: orderErrors, error: contractCallError } = useCheckOrder({
    // FIXME: don't hardcode this - take from order if supplied, or get default for current chain.
    swapContract: {
      chainId: selectedChainId,
      address: swapContract as `0x${string}`,
    },
    enabled: schemaValid,
    order: schemaValid ? schemaValidationResult.data : undefined,
  });

  return {
    schemaValidationResult,
    orderErrors: orderErrors?.map((e) => hexToString(e)),
    contractCallError,
    orderParsingError,
    schemaValidationError: !schemaValid && schemaValidationResult.error,
  };
};
