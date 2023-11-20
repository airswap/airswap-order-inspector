// checkParamsJSON is used for user-generated JSON
export interface CheckParamsJSON {
  senderWallet: `0x${string}`;
  nonce: string;
  expiry: string;
  signerWallet: `0x${string}`;
  signerToken: `0x${string}`;
  signerAmount: string;
  senderToken: `0x${string}`;
  senderAmount: string;
  v: string;
  r: string;
  s: string;
}

// checekArgs is used for the smart contract function read
export type CheckArgs = [
  `0x${string}`,
  bigint,
  bigint,
  `0x${string}`,
  `0x${string}`,
  bigint,
  `0x${string}`,
  bigint,
  number,
  `0x${string}`,
  `0x${string}`
];

export enum InputType {
  JSON,
  URL,
}
