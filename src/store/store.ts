import { create } from 'zustand';

export interface SelectStore {
  isDisabled: boolean;
  setIsDisabled: (disabled: boolean) => void;
}

export interface ChainStore {
  selectedChainId: number;
  setSelectedChainId: (chain: number) => void;
}

export const useSelectStore = create<SelectStore>((set) => ({
  isDisabled: false,
  setIsDisabled: (disabled) => set({ isDisabled: disabled }),
}));

export const useChainStore = create<ChainStore>((set) => ({
  selectedChainId: 1,
  setSelectedChainId: (chain) => set({ selectedChainId: chain }),
}));
