import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './globals.css';
import { ThemeProvider } from './features/theme/ThemeProvider.tsx';
import { Web3ModalProvider } from './features/wallet/Web3ModalProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Web3ModalProvider>
        <App />
      </Web3ModalProvider>
    </ThemeProvider>
  </React.StrictMode>
);
