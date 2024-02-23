import { SelectOptions } from '../../types';
import * as RadixSelect from '@radix-ui/react-select';
import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export const Select = ({
  setSelectedChainId,
  selectOptions,
  chainIdFromJson,
}: {
  setSelectedChainId: (value: number) => void;
  selectOptions: SelectOptions;
  chainIdFromJson: string | undefined;
}) => {
  const [selectedValue, setSelectedValue] = useState(
    chainIdFromJson || selectOptions[0].value
  );
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);

  const handleIsSelectOpen = () => {
    setIsSelectOpen((isSelectOpen) => !isSelectOpen);
  };

  // if chainIdFromJson is valid, disable the selector and override it with chainIdFromJson
  const checkForChainIdMatch = (
    chainIdFromJson: string | number | undefined
  ): boolean =>
    selectOptions.some(
      (option) => option.value === chainIdFromJson?.toString()
    );

  const isChainIdFromJsonValid = checkForChainIdMatch(chainIdFromJson);

  console.log(
    'chainIdFromJson:',
    chainIdFromJson,
    !!chainIdFromJson && isChainIdFromJsonValid
  );

  const selectValue = checkForChainIdMatch(chainIdFromJson)
    ? chainIdFromJson
    : selectedValue;

  const renderOptions = () => {
    return selectOptions.map((chain) => (
      <RadixSelect.Item
        defaultValue={selectOptions[2].value}
        value={chain.value}
        key={chain.value}
        className="py-1 px-2 bg-blueGray text-lightGray border border-blueExtraDark first:rounded-t-sm last:rounded-b-sm hover:bg-blueExtraDark hover:border-blueExtraDark active:border-white"
      >
        <RadixSelect.ItemText>
          {chain.label}: {chain.value}
        </RadixSelect.ItemText>
        <RadixSelect.ItemIndicator>{chain.value}</RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    ));
  };
  const options = renderOptions();

  // if chain is found in JSON, programatically change the selector
  useEffect(() => {
    if (chainIdFromJson) {
      setSelectedChainId(+chainIdFromJson);
    }
  }, [chainIdFromJson, setSelectedChainId]);

  useEffect(() => {
    if (chainIdFromJson && chainIdFromJson !== selectedValue) {
      setSelectedValue(chainIdFromJson);
      setSelectedChainId(+chainIdFromJson);
    }
  }, [chainIdFromJson, selectedValue, setSelectedChainId]);

  return (
    <>
      <RadixSelect.Root
        onValueChange={() => {
          console.log(selectedValue);
          return selectedValue;
        }}
        onOpenChange={handleIsSelectOpen}
        disabled={!!chainIdFromJson && isChainIdFromJsonValid}
      >
        <RadixSelect.Trigger
          className="flex items-center px-3 py-1 bg-blueGray border border-blueGray rounded-md font-semibold uppercase"
          aria-label="chain id"
        >
          <RadixSelect.Value
            placeholder={
              isChainIdFromJsonValid
                ? `Chain ID: ${chainIdFromJson}`
                : 'Ethereum: 1'
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
