// typings.d.ts

interface ImportMetaEnv {
  VITE_WALLET_CONNECT_PROJECT_ID: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
