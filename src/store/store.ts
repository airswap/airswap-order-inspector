import { create } from 'zustand';

interface AppStore {
  isSelectDisabled: boolean;
  setIsSelectDisabled: (disabled: boolean) => void;
  selectedChainId: number;
  setSelectedChainId: (chainId: number) => void;
  swapContractAddress: string | undefined;
  setSwapContractAddress: (address: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isSelectDisabled: false,
  setIsSelectDisabled: (disabled) => set({ isSelectDisabled: disabled }),
  selectedChainId: 1,
  setSelectedChainId: (chainId) => set({ selectedChainId: chainId }),
  swapContractAddress: undefined,
  setSwapContractAddress: (address) => set({ swapContractAddress: address }),
}));
