import * as RadixSelect from '@radix-ui/react-select';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { chainIdOptions } from '@/lib/chainIdOptions';
import { useAppStore } from '@/store/store';

export const ChainSelector = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const { isSelectDisabled, selectedChainId, setSelectedChainId } =
    useAppStore();

  const handleIsSelectOpen = () => {
    setIsSelectOpen((isSelectOpen) => !isSelectOpen);
  };

  const handleSelectChange = (chain: number) => {
    if (!isSelectDisabled) {
      setSelectedChainId(Number(chain));
    }
  };

  return (
    <>
      <RadixSelect.Root
        disabled={isSelectDisabled}
        onValueChange={(val: string) => {
          handleSelectChange(Number(val));
        }}
        onOpenChange={handleIsSelectOpen}
      >
        <RadixSelect.Trigger
          className={`flex items-center ${isSelectOpen && 'py-3 px-5 border border-blueExtraDark'} bg-blueGray rounded-sm font-semibold uppercase`}
          aria-label="chain id"
        >
          <RadixSelect.Value
            placeholder={
              isSelectDisabled ? selectedChainId.toString() : 'Select chain Id'
            }
            className={isSelectDisabled ? 'opacity-50' : 'opacity-0'}
          />

          <RadixSelect.Icon className="ml-2">
            <div
              className={`${
                isSelectOpen
                  ? 'transition-transform rotate-180'
                  : 'transition-transform rotate-0'
              }`}
            >
              <FaChevronDown />
            </div>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            className="h-[340px] rounded-md border"
          >
            <RadixSelect.ScrollUpButton className="SelectScrollButton">
              <RadixSelect.ScrollUpButton />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport className="max-h-[200px] overflow-y-auto">
              {chainIdOptions.map((chain) => (
                <RadixSelect.Item
                  value={chain.value}
                  key={chain.value}
                  className="py-3 px-5 bg-background text-lightGray border border-b-0.5 first:rounded-t-md last:rounded-b-sm hover:bg-blueExtraDark"
                >
                  <RadixSelect.ItemText>
                    {chain.label}: {chain.value}
                  </RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    {chain.value}
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
            <RadixSelect.Arrow />
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </>
  );
};
