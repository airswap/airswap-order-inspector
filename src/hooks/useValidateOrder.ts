import { useAppStore } from '@/store/store';
import { SwapERC20 } from '@airswap/libraries';
import { hexToString } from 'viem';
import { SignedOrder, signedOrderSchema } from '../utils/orderSchema';
import { parseOrderFromUrl } from '../utils/parseOrderFromUrl';
import { useCheckOrder } from './useCheckOrder';

export const useValidateOrder = ({
  orderText,
  protocolFee,
}: {
  orderText?: string;
  protocolFee: number | undefined;
}) => {
  const { selectedChainId } = useAppStore();

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
  const schemaWithExpectedFee = signedOrderSchema(protocolFee);

  const schemaValidationResult = schemaWithExpectedFee.safeParse(_order);
  const schemaValid = schemaValidationResult.success;
  let order: SignedOrder | undefined = undefined;
  if (schemaValid) {
    order = schemaValidationResult.data;
  }

  const _chainId = order?.chainId || selectedChainId;
  const _swapContractAddress =
    order?.swapContract || SwapERC20.getAddress(_chainId);

  const {
    data: orderErrors,
    error: contractCallError,
    isLoading: isChecking,
  } = useCheckOrder({
    chainId: _chainId,
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
    isChecking,
    schemaValidationError: !schemaValid && schemaValidationResult.error,
  };
};
