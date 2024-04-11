import { SelectStore, useChainStore, useSelectStore } from '@/store/store';
import { SwapERC20 } from '@airswap/libraries';
import { useEffect } from 'react';
import { hexToString } from 'viem';
import { SignedOrder, signedOrderSchema } from '../utils/orderSchema';
import { parseOrderFromUrl } from '../utils/parseOrderFromUrl';
import { useCheckOrder } from './useCheckOrder';

export const useValidateOrder = ({
  orderText,
}: {
  orderText?: string;
  // onSetChain?: (chainId: number) => void;
}) => {
  const setIsSelectDisabled = useSelectStore(
    (state: SelectStore) => state.setIsSelectDisabled
  );
  const { selectedChainId, setSelectedChainId } = useChainStore();

  //
  let _order;
  let orderParsingError;
  if (orderText) {
    const isUrl = !orderText.startsWith('{');
    try {
      _order = isUrl ? parseOrderFromUrl(orderText) : JSON.parse(orderText);
    } catch (e) {
      orderParsingError = e;
    }
  }

  // Check if the parsed order is valid.
  const schemaValidationResult = signedOrderSchema.safeParse(_order);
  const schemaValid = schemaValidationResult.success;
  let order: SignedOrder | undefined = undefined;
  if (schemaValid) {
    order = schemaValidationResult.data;
  }

  const _chainId = order?.chainId || selectedChainId;
  const _swapContractAddress =
    order?.swapContract || SwapERC20.getAddress(_chainId);

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

  const { data: orderErrors, error: contractCallError } = useCheckOrder({
    swapContract: _swapContractAddress as `0x${string}`,
    enabled: schemaValid,
    order: schemaValid ? schemaValidationResult.data : undefined,
  });

  return {
    order,
    schemaValidationResult,
    orderErrors: orderErrors?.map((e) => hexToString(e)),
    contractCallError,
    orderParsingError,
    schemaValidationError: !schemaValid && schemaValidationResult.error,
  };
};
