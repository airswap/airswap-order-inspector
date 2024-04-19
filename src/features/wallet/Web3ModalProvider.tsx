import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { WagmiProvider } from 'wagmi';
import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  bscTestnet,
  linea,
  lineaTestnet,
  mainnet,
  polygon,
  polygonMumbai,
  sepolia,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '1';

// 2. Create wagmiConfig
const metadata = {
  // TODO: double check these values
  name: 'AirSwap Checker',
  description:
    'AirSwap Makers can use the AirSwap Checker app to debug their JSON objects in their API setup',
  url: 'https://check.airswap.eth.limo/',
  icons: ['https://avatars.githubusercontent.com/u/26823563?s=200&v=4'],
};

const chains = [
  mainnet,
  sepolia,
  bsc,
  bscTestnet,
  polygon,
  polygonMumbai,
  linea,
  lineaTestnet,
  base,
  arbitrum,
  avalanche,
  avalancheFuji,
] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional - false as default
});

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
