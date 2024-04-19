import { Address } from 'viem';
import { ZodError } from 'zod';

export type SchemaValidationError =
  | false
  | ZodError<{
      nonce: number;
      signerWallet: string;
      senderWallet: string | null;
      expiry: number;
      signerToken: string;
      signerAmount: string;
      senderToken: string;
      senderAmount: string;
      v: number;
      r: string;
      s: string;
      chainId: number;
      swapContract: Address;
      protocolFee?: number | undefined;
    }>;
