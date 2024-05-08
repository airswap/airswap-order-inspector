import { nullable, z } from 'zod';

const address = () => z.string().startsWith('0x').length(42);
const stringNumber = () => z.string().regex(/^[0-9]*$/);

export const signedOrderSchema = (expectedProtocolFee?: number | undefined) => {
  const protocolFeeValidator = z
    .number()
    .optional()
    .refine(
      (protocolFee) => {
        if (protocolFee !== undefined && expectedProtocolFee !== undefined) {
          return protocolFee === expectedProtocolFee;
        }
        return true; // Allow undefined protocolFee
      },
      {
        message: (value) =>
          `Invalid protocolFee: expected ${expectedProtocolFee}, got ${value}`,
      }
    );

  return z.object({
    nonce: z.coerce.number(),
    expiry: z.coerce.number(),
    signerWallet: address(),
    signerToken: address(),
    signerAmount: stringNumber(),
    senderToken: address(),
    senderAmount: stringNumber(),
    senderWallet: nullable(address()),
    v: z.coerce.number(),
    r: z.string().startsWith('0x').length(66),
    s: z.string().startsWith('0x').length(66),

    // optionals.
    chainId: z.coerce.number().optional(),
    swapContract: address().optional(),
    protocolFee: protocolFeeValidator,
  });
};

export type SignedOrder = z.infer<ReturnType<typeof signedOrderSchema>>;
