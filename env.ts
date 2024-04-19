// env.ts
import { defineConfig, Schema } from '@julr/vite-plugin-validate-env';

// ref: https://github.com/Julien-R44/vite-plugin-validate-env?tab=readme-ov-file#built-in-validator
export default defineConfig({
  VITE_WALLET_CONNECT_PROJECT_ID: Schema.string(),
});
