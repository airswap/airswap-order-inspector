import { ChainIds } from '@airswap/constants';

export const blockExplorers: { [x: number]: string } = {
  [ChainIds.ARBITRUM]: 'https://arbiscan.io',
  [ChainIds.ARBITRUMGOERLI]: 'https://goerli.arbiscan.io',
  [ChainIds.AVALANCHE]: 'https://snowtrace.io',
  [ChainIds.FUJI]: 'https://testnet.snowtrace.io',
  [ChainIds.BASE]: 'https://basescan.org',
  [ChainIds.BSC]: 'https://bscscan.com',
  [ChainIds.BSCTESTNET]: 'https://testnet.bscscan.com',
  [ChainIds.LINEA]: 'https://lineascan.build',
  [ChainIds.LINEAGOERLI]: 'https://goerli.lineascan.build',
  [ChainIds.MAINNET]: 'https://etherscan.io',
  [ChainIds.POLYGON]: 'https://polygonscan.com',
  [ChainIds.MUMBAI]: 'https://mumbai.polygonscan.com',
  [ChainIds.RSK]: 'https://explorer.rsk.co',
  [ChainIds.SEPOLIA]: 'https://sepolia.etherscan.io',
  [ChainIds.TELOS]: 'https://www.teloscan.io',
  [ChainIds.TELOSTESTNET]: 'https://testnet.teloscan.io',
};
