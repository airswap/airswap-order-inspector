import { hexToString } from 'viem';
import { useCheckOrder } from './useCheckOrder';
import { signedOrderSchema } from '../utils/orderSchema';
import { parseOrderFromUrl } from '../utils/parseOrderFromUrl';
import {
  SwapContractAddressStore,
  useChainStore,
  useSelectStore,
  useSwapContractAddressStore,
} from '@/store/store';
import { SelectStore } from '@/store/store';
import { useEffect } from 'react';

export const useValidateOrder = ({
  order,
  isUrl,
  swapContract,
  // onSetChain,
}: {
  order?: string;
  isUrl: boolean;
  swapContract: string | undefined;
  // onSetChain?: (chainId: number) => void;
}) => {
  const setIsSelectDisabled = useSelectStore(
    (state: SelectStore) => state.setIsSelectDisabled
  );
  const { selectedChainId, setSelectedChainId } = useChainStore();

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

  useEffect(() => {
    if (schemaValid && schemaValidationResult.data.chainId) {
      const chainId = schemaValidationResult.data.chainId;

      if (selectedChainId !== chainId) {
        setSelectedChainId(chainId);
      }
      // if chainId is in JSON, disable Selector component
      setIsSelectDisabled(true);
    } else {
      setIsSelectDisabled(false);
    }
  }, [
    schemaValid,
    schemaValidationResult,
    selectedChainId,
    setIsSelectDisabled,
    setSelectedChainId,
  ]);

  // if swapContractAddress is present, we want to pass it into the store, then into `usecontractAddress` hook to set eip721domain info
  useEffect(() => {
    if (schemaValid && schemaValidationResult.data.swapContract) {
      const contractAddress = schemaValidationResult.data.swapContract;

      // Update swapContractAddress in the store after rendering
      setSwapContractAddress(contractAddress);
    }
  }, [schemaValid, schemaValidationResult, setSwapContractAddress]);

  const { data: orderErrors, error: contractCallError } = useCheckOrder({
    swapContract: swapContract as `0x${string}`,
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
