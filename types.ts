// ParsedJsonParams is used to validate JSON, not for smart contract read function
export interface ParsedJsonParams {
  nonce: string | number;
  expiry: string;
  signerWallet: `0x${string}`;
  signerToken: `0x${string}`;
  signerAmount: string;
  senderToken: `0x${string}`;
  senderAmount: string;
  v: string;
  r: string;
  s: string;
  senderWallet?: `0x${string}`;
  chainId?: string;
  swapContract?: `0x${string}`;
  protocolFee?: '7';
}

// checkArgs is used for the smart contract read function
export type CheckFunctionArgs = [
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

export enum ChainIds {
  Ethereum = 1,
  RSK = 30,
  TelosEVMMainnet = 40,
  BSC = 56,
  Polygon = 137,
  Base = 8453,
  Arbitrum = 42161,
  Avalanche = 43114,
  Linea = 59144,
  Goerli = 5,
  RSKTestnet = 31,
  TelosEVMTestnet = 41,
  BSCTestnet = 97,
  FujiTestnet = 43113,
  LineaGoerli = 59140,
  MumbaiTestnet = 80001,
  BaseGorli = 84531,
  ArbitrumGoerli = 421613,
  Sepolia = 11155111,
}

export type RequiredValues = {
  domainChainId: bigint | undefined;
  domainVerifyingContract: string | undefined;
  domainName: string | undefined;
  domainVersion: string | undefined;
  protocolFee: bigint | undefined;
};

export type SelectOptions = {
  value: string;
  label: string;
}[];
