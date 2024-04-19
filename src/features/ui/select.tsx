import * as RadixSelect from '@radix-ui/react-select';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { SelectOption, SelectOptions } from '@/lib/chainIdOptions';

export const Select = ({
  isSelectDisabled = false,
  handleSelectChange,
  placeholderValue,
  placeholderFiller,
  selectOptions,
}: {
  isSelectDisabled: boolean;
  handleSelectChange: (val: string) => void;
  placeholderValue: string;
  placeholderFiller: string | JSX.Element;
  selectOptions: SelectOptions;
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleIsSelectOpen = (): void => {
    setIsSelectOpen((isSelectOpen) => !isSelectOpen);
  };

  return (
    <>
      <RadixSelect.Root
        disabled={isSelectDisabled}
        onValueChange={(val: string) => handleSelectChange(val)}
        onOpenChange={handleIsSelectOpen}
      >
        <RadixSelect.Trigger
          className={`flex items-center ${isSelectOpen && 'py-3 px-5 border border-blueExtraDark'} bg-blueGray rounded-sm font-semibold uppercase`}
          aria-label="chain id"
        >
          <RadixSelect.Value placeholder={placeholderValue}>
            {placeholderFiller}
          </RadixSelect.Value>

          <RadixSelect.Icon className="ml-2">
            <div
              className={`${
                isSelectOpen
                  ? 'transition-transform rotate-180'
                  : 'transition-transform rotate-0'
              } ${isSelectDisabled ? 'hidden' : 'block'}`}
            >
              <FaChevronDown />
            </div>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            className="h-fit rounded-md border"
          >
            <RadixSelect.ScrollUpButton className="SelectScrollButton">
              <RadixSelect.ScrollUpButton />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport className="max-h-[200px] overflow-y-auto">
              {selectOptions.map((option: SelectOption) => (
                <RadixSelect.Item
                  value={option.value}
                  key={option.value}
                  className="py-3 px-5 bg-background text-lightGray border border-b-0.5 first:rounded-t-md last:rounded-b-sm hover:bg-blueExtraDark"
                >
                  <RadixSelect.ItemText>
                    {option.label}: {option.value}
                  </RadixSelect.ItemText>
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
