import React from 'react';
import { twMerge } from 'tailwind-merge';
import { renderErrors } from './ErrorsList';

export const Errors = ({
  isLoading,
  errors,
  isNoErrors,
}: {
  isLoading: boolean;
  errors: string[];
  isNoErrors: boolean;
}) => {
  console.log('isNoErrors', isNoErrors);
  const errorsList = renderErrors({ errors });

  return (
    <React.Fragment>
      {!isLoading && (
        <>
          <h3 className="mt-2 mb-4 px-2 text-xl font-semibold uppercase">
            Errors:
          </h3>
          <div
            id="errors-container"
            className={twMerge(
              'w-full sm:w-4/5 md:w-full lg:w-[90%]',
              'mt-2 mx-auto p-4 lg:p-6 border bg-blueGray rounded-md',
              errors.length < 1 && !isNoErrors && 'border-none',
              errors.length > 0 && 'border-redAlert border-dashed',
              errors.length > 0 && isNoErrors && 'border-white border-solid'
            )}
          >
            {!isNoErrors ? (
              <ul className="list-none break-words">{errorsList}</ul>
            ) : (
              <h3 className="mb-1 text-lg font-semibold uppercase">
                🎊 No errors found! 🎊
              </h3>
            )}
          </div>
        </>
      )}
    </React.Fragment>
  );
};
