import React from 'react';
import ReactDOM from 'react-dom/client';
import './init';
import './index.css';
import { WagmiConfig } from 'wagmi';
import { config } from './wagmiConfig/config.ts';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
