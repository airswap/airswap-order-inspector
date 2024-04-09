import * as RadixSelect from '@radix-ui/react-select';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { chainIdOptions } from '@/lib/chainIdOptions';
import { useChainStore, useSelectStore } from '@/store/store';

export const Select = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const { isSelectDisabled } = useSelectStore();
  const { setSelectedChainId, selectedChainId } = useChainStore();

  const handleIsSelectOpen = () => {
    setIsSelectOpen((isSelectOpen) => !isSelectOpen);
  };

  const renderOptions = () => {
    return chainIdOptions.map((chain) => (
      <RadixSelect.Item
        value={chain.value}
        key={chain.value}
        className="py-1 px-2 bg-background text-lightGray first:rounded-t-sm last:rounded-b-sm hover:bg-blueExtraDark"
      >
        <RadixSelect.ItemText>
          {chain.label}: {chain.value}
        </RadixSelect.ItemText>
        <RadixSelect.ItemIndicator>{chain.value}</RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    ));
  };
  const options = renderOptions();

  const handleSelectChange = (chain: string) => {
    if (isSelectDisabled) {
      return;
    } else {
      setSelectedChainId(Number(chain));
    }
  };

  return (
    <>
      <RadixSelect.Root
        disabled={isSelectDisabled}
        onValueChange={(val) => {
          handleSelectChange(val);
        }}
        onOpenChange={handleIsSelectOpen}
      >
        <RadixSelect.Trigger
          className="flex items-center px-3 py-1 bg-blueGray border border-blueExtraDark rounded-sm font-semibold uppercase"
          aria-label="chain id"
        >
          <RadixSelect.Value
            placeholder={
              isSelectDisabled ? selectedChainId.toString() : 'chain Id'
            }
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
            <RadixSelect.ScrollUpButton />
            <RadixSelect.Viewport>{options}</RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton />
            <RadixSelect.Arrow />
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </>
  );
};
