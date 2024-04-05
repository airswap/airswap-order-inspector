import { create } from 'zustand';

export interface SelectStore {
  isSelectDisabled: boolean;
  setIsSelectDisabled: (disabled: boolean) => void;
}

export interface ChainStore {
  selectedChainId: number;
  setSelectedChainId: (chain: number) => void;
}

export const useSelectStore = create<SelectStore>((set) => ({
  isSelectDisabled: false,
  setIsSelectDisabled: (disabled) => set({ isSelectDisabled: disabled }),
}));

export const useChainStore = create<ChainStore>((set) => ({
  selectedChainId: 1,
  setSelectedChainId: (chain) => set({ selectedChainId: chain }),
}));

export interface AppStore {
  isCheckEnabled: boolean;
  setIsCheckEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isCheckEnabled: false,
  setIsCheckEnabled: (enabled) => set({ isCheckEnabled: enabled }),
}));
