import { configureChains, createConfig } from 'wagmi';
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
  mainnet,
  polygon,
  polygonMumbai,
  sepolia,
  telos,
  telosTestnet,
} from 'viem/chains';
import { rsk, rskTestnet } from './customChains';
import { publicProvider } from 'wagmi/providers/public';

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
  [publicProvider()],
  { batch: { multicall: false } }
);

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});
