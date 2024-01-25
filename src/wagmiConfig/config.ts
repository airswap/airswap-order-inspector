import { configureChains, createConfig } from 'wagmi';
import {
  Chain,
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
  mainnet,
  polygon,
  polygonMumbai,
  sepolia,
  telos,
  telosTestnet,
} from 'viem/chains';
import { rsk, rskTestnet } from './customChains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { apiUrls } from '../../tools/constants';

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
  [
    jsonRpcProvider({
      rpc: (chain: Chain) => ({
        http: apiUrls[chain.id],
      }),
    }),
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY || '' }),
    publicProvider(),
  ],
  { batch: { multicall: false } }
);

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});
