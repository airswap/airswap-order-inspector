export type SelectOptions = {
  value: string;
  label: string;
}[];

export const chainIdOptions: SelectOptions = [
  { value: '1', label: 'Ethereum' },
  { value: '56', label: 'BSC' },
  { value: '137', label: 'Polygon' },
  { value: '8453', label: 'Base' },
  { value: '42161', label: 'Arbitrum' },
  { value: '43114', label: 'Avalanche' },
  { value: '59144', label: 'Linea' },
  { value: '97', label: 'BSC Testnet' },
  { value: '43113', label: 'Fuji Testnet' },
  { value: '59140', label: 'LineaGoerli' },
  { value: '80001', label: 'Mumbai Testnet' },
  { value: '11155111', label: 'Sepolia' },
];
