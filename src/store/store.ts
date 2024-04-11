import { create } from 'zustand';

export interface SelectStore {
  isSelectDisabled: boolean;
  setIsSelectDisabled: (disabled: boolean) => void;
}

export interface ChainStore {
  selectedChainId: number;
  setSelectedChainId: (chainId: number) => void;
}

export interface SwapContractAddressStore {
  swapContractAddress: string | undefined;
  setSwapContractAddress: (address: string) => void;
}

export const useSelectStore = create<SelectStore>((set) => ({
  isSelectDisabled: false,
  setIsSelectDisabled: (disabled) => set({ isSelectDisabled: disabled }),
}));

export const useChainStore = create<ChainStore>((set) => ({
  selectedChainId: 1,
  setSelectedChainId: (chainId) => set({ selectedChainId: chainId }),
}));

export interface AppStore {
  isCheckEnabled: boolean;
  setIsCheckEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isCheckEnabled: false,
  setIsCheckEnabled: (enabled) => set({ isCheckEnabled: enabled }),
}));

export const useSwapContractAddressStore = create<SwapContractAddressStore>(
  (set) => ({
    swapContractAddress: undefined,
    setSwapContractAddress: (address) => set({ swapContractAddress: address }),
  })
);
