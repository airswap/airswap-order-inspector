import { Chain, defineChain } from 'viem';

export const rsk: Chain = defineChain({
  id: 30,
  name: 'RSK Mainnet',
  network: 'rsk',
  nativeCurrency: {
    decimals: 18,
    name: 'SmartBitcoin',
    symbol: 'RBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://public-node.rsk.co'],
      webSocket: ['wss://public-node.rsk.co'],
    },
    public: {
      http: ['https://public-node.rsk.co'],
      webSocket: ['wss://public-node.rsk.co'],
    },
  },
  blockExplorers: {
    default: { name: 'RSK Explorer', url: 'https://explorer.rsk.co' },
  },
  contracts: {
    multicall3: {
      address: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
      blockCreated: 5711587,
    },
  },
});

export const rskTestnet: Chain = defineChain({
  id: 31,
  name: 'RSK Testnet',
  network: 'rsk_testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Testnet SmartBitcoin',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://public-node.testnet.rsk.co'],
      webSocket: ['wss://public-node.testnet.rsk.co'],
    },
    public: {
      http: ['https://public-node.testnet.rsk.co'],
      webSocket: ['wss://public-node.testnet.rsk.co'],
    },
  },
  blockExplorers: {
    default: {
      name: 'RSK Testnet Explorer',
      url: 'https://explorer.testnet.rsk.co',
    },
  },
  contracts: {
    multicall3: {
      address: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
      blockCreated: 4370691,
    },
  },
});
