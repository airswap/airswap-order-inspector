import { SelectOptions } from '../../types';
import * as RadixSelect from '@radix-ui/react-select';
import { FaChevronDown } from 'react-icons/fa';
import { FaChevronUp } from 'react-icons/fa';

export const Select = ({
  setSelectedChainId,
  selectOptions,
}: {
  setSelectedChainId: (value: number) => void;
  selectOptions: SelectOptions;
}) => {
  const renderOptions = () => {
    return selectOptions.map((chain) => (
      <RadixSelect.Item
        value={chain.value}
        key={chain.value}
        className="py-1 px-2 bg-blueGray text-lightGray border border-grayDark first:rounded-t-sm last:rounded-b-sm hover:bg-blueExtraDark active:border-white"
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
    setSelectedChainId(Number(chain));
  };

  return (
    <>
      <RadixSelect.Root onValueChange={(val) => handleSelectChange(val)}>
        <RadixSelect.Trigger
          className="flex items-center px-3 py-1 bg-blueGray border border-blueGray rounded-md font-semibold uppercase"
          aria-label="network"
        >
          <RadixSelect.Value placeholder="network" />
          <RadixSelect.Icon className="ml-2">
            <FaChevronDown />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            className="h-[340px] border border-blueExtraDark rounded-md"
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
