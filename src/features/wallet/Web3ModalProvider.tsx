import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

// 2. Create wagmiConfig
const metadata = {
  // FIXME: update these with real values
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, sepolia] as const;
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
