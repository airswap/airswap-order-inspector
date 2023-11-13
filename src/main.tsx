import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
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
