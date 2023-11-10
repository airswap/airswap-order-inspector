export interface checkParamsJSON {
  senderWallet: `0x${string}`;
  nonce: number;
  expiry: number;
  signerWallet: `0x${string}`;
  signerToken: `0x${string}`;
  signerAmount: bigint;
  senderToken: `0x${string}`;
  senderAmount: bigint;
  v: number;
  r: string;
  s: string;
}
