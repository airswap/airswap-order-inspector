import { nullable, z } from "zod";

const address = () => z.string().startsWith("0x").length(42);
const stringNumber = () => z.string().regex(/^[0-9]*$/);

export const signedOrderSchema = z.object({
  nonce: z.coerce.number(),
  expiry: z.coerce.number(),
  signerWallet: address(),
  signerToken: address(),
  signerAmount: stringNumber(),
  senderToken: address(),
  senderAmount: stringNumber(),
  senderWallet: nullable(address()),
  v: z.coerce.number(),
  r: z.string().startsWith("0x").length(66),
  s: z.string().startsWith("0x").length(66),

  // optionals.
  chainId: z.coerce.number().optional(),
  swapContract: address().optional(),
  protocolFee: z.coerce.number().optional(),
});

export type SignedOrder = z.infer<typeof signedOrderSchema>;
