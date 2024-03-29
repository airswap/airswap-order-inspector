import { decompressFullOrderERC20 } from "@airswap/utils";

export const parseOrderFromUrl = (url: string) => {
  const compressedOrder = url.split("order/")[1];

  if (!compressedOrder)
    throw new Error("Expected order containing `/order/[compressedOrderData]`");

  return decompressFullOrderERC20(compressedOrder);
};
