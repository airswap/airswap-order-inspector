import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export const Errors = ({
  isLoading,
  isNoErrors,
  renderedErrors,
}: {
  isLoading: boolean;
  isNoErrors: boolean;
  renderedErrors: ReactNode;
}) => {
  return (
    <div
      className={twMerge(
        'md:w-full md:pt-4 md:ml-2 md:mt-0',
        'mt-4 pt-4 pb-8 px-1 bg-lightGray rounded-sm'
      )}
    >
      {!isLoading && (
        <>
          <h3 className="mt-2 mb-4 px-2 text-lg text-redAlert font-semibold uppercase">
            Errors to fix:
          </h3>
          <div
            id="errors-container"
            className={twMerge(
              'w-full xs:w-[90%] sm:w-4/5 ',
              'mt-2 mx-auto p-5 min-h-[325px] border-dashed border-2 border-redAlert rounded-sm text-redAlert'
            )}
          >
            {!isNoErrors ? (
              <ul className="flex flex-col items-start w-fit m-auto p-0 list-none">
                {renderedErrors}
              </ul>
            ) : (
              <h3 className="m-0 mb-1 text-blueExtraDark font-semibold uppercase">
                🎊 No errors found! 🎊
              </h3>
            )}
          </div>
        </>
      )}
    </div>
  );
};
