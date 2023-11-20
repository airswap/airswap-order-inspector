import { ChangeEvent, MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';
import { textareaUrlPlaceholder } from '../../placeholders/textareaUrlPlaceholder';

export const UrlForm = ({
  handleSubmit,
  handleChangeTextArea,
  isEnableCheck,
  isLoading,
}: {
  handleSubmit: (e: MouseEvent<HTMLFormElement>) => void;
  handleChangeTextArea: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isEnableCheck: boolean;
  isLoading: boolean;
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col m-auto w-full">
      <label
        htmlFor="urlInput"
        className="mt-4 mb-2 text-lg font-semibold uppercase"
      >
        Paste URL below:
      </label>
      <textarea
        id="urlInput"
        name="urlInput"
        placeholder={textareaUrlPlaceholder}
        autoComplete="off"
        onChange={handleChangeTextArea}
        className={twMerge(
          'w-full xs:w-[90%] sm:w-4/5 md:w-4/5',
          'mb-2 mx-auto p-5 min-h-[325px] border-blueDark border rounded-sm',
          'placeholder:text-sm'
        )}
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
        className={twMerge(
          'w-full xs:w-[90%] sm:w-4/5 md:w-4/5',
          'mt-2 mx-auto py-3 px-4 text-white bg-blueAirSwap border-darkgray border-1 rounded-sm font-medium text-lg uppercase'
        )}
      />
    </form>
  );
};
