import { ChangeEvent, MouseEvent } from 'react';
import { textareaPlaceholder } from '../../placeholders/textareaJsonPlaceholder';
import { Select } from '../Select';
import { chainIdOptions } from '../../utilities/chainIdOptions';

export const JsonForm = ({
  handleSubmit,
  handleChangeTextArea,
  isEnableCheck,
  isLoading,
  // setIsEnableCheck,
  setSelectedChainId,
}: {
  handleSubmit: (e: MouseEvent<HTMLFormElement>) => void;
  handleChangeTextArea: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isEnableCheck: boolean;
  isLoading: boolean;
  // setIsEnableCheck: (value: boolean) => void;
  setSelectedChainId: (value: number) => void;
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col m-auto w-full">
      <div className="flex flex-row w-full justify-between items-center py-2 m-auto ">
        <label
          htmlFor="jsonInput"
          className="ml-1 w-fit font-semibold uppercase "
        >
          Paste JSON below:
        </label>
        <div>
          <Select
            // setIsEnableCheck={setIsEnableCheck}
            setSelectedChainId={setSelectedChainId}
            selectOptions={chainIdOptions}
          />
        </div>
      </div>
      <textarea
        id="jsonInput"
        name="jsonInput"
        placeholder={textareaPlaceholder}
        autoComplete="off"
        onChange={handleChangeTextArea}
        className="w-full mb-2 mx-auto p-5 min-h-[325px] bg-blueExtraDark border-blueGray border rounded-sm placeholder:text-sm"
      />
      {isEnableCheck && (
        <div className="md:hidden italic opacity-40 font-medium">
          Scroll down to view errors...
        </div>
      )}
      <input
        name="submit"
        type="submit"
        value={!isLoading ? 'Check errors' : 'Loading...'}
        disabled={isLoading}
        className="w-full mt-4 mx-auto py-3 px-4 text-white bg-blueAirSwap border-darkgray border-1 rounded-sm font-medium text-lg uppercase"
      />
    </form>
  );
};
