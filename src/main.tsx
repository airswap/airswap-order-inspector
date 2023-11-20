import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import {
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  base,
  baseGoerli,
  bsc,
  bscTestnet,
  goerli,
  linea,
  lineaTestnet,
  polygon,
  polygonMumbai,
  sepolia,
  telos,
  telosTestnet,
} from 'viem/chains';
import { defineChain } from 'viem';

export const rsk = defineChain({
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

export const rskTestnet = defineChain({
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

const { publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    rsk,
    rskTestnet,
    goerli,
    telos,
    bsc,
    polygon,
    base,
    arbitrum,
    avalanche,
    linea,
    telosTestnet,
    bscTestnet,
    avalancheFuji,
    lineaTestnet,
    polygonMumbai,
    baseGoerli,
    arbitrumGoerli,
    sepolia,
  ],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
