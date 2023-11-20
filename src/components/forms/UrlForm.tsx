import { ChangeEvent, MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';
import { textareaUrlPlaceholder } from '../../defaults/textareaUrlPlaceholder';

export const UrlForm = ({
  handleSubmit,
  handleChangeTextArea,
  isLoading,
}: {
  handleSubmit: (e: MouseEvent<HTMLFormElement>) => void;
  handleChangeTextArea: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col m-auto w-full">
      <label className="my-2 text-lg font-semibold uppercase">
        JSON server response below:
      </label>
      <textarea
        id="json"
        name="json"
        placeholder={textareaUrlPlaceholder}
        autoComplete="off"
        onChange={handleChangeTextArea}
        className={twMerge(
          'w-full xs:w-[90%] sm:w-4/5 md:w-4/5',
          'my-2 mx-auto p-5 min-h-[325px] border-blueDark border-2 rounded-sm',
          'placeholder:text-sm'
        )}
      />
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
