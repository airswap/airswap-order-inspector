import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export const Errors = ({
  isLoading,
  errors,
  isNoErrors,
  renderedErrors,
}: {
  isLoading: boolean;
  errors: string[];
  isNoErrors: boolean;
  renderedErrors: ReactNode;
}) => {
  return (
    <div
      className={twMerge(
        'md:w-full md:pt-4 md:ml-2 md:mt-0',
        'mt-4 pt-4 pb-8 px-1 bg-blueDark rounded-md text-lightGray',
        'border border-blueGray'
      )}
    >
      {!isLoading && (
        <>
          <h3 className="mt-2 mb-4 px-2 text-xl font-semibold uppercase">
            Errors:
          </h3>
          <div
            id="errors-container"
            className={twMerge(
              'xs:w-[90%] sm:w-4/5 w-full',
              'mt-2 mx-auto p-4 lg:p-6 border bg-blueGray rounded-md',
              errors.length > 0 && 'border-redAlert',
              errors.length > 0 && isNoErrors && 'border-white'
            )}
          >
            {!isNoErrors ? (
              <ul className="list-none">{renderedErrors}</ul>
            ) : (
              <h3 className="mb-1 font-semibold uppercase">
                🎊 No errors found! 🎊
              </h3>
            )}
          </div>
        </>
      )}
    </div>
  );
};
