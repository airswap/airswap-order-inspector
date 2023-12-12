import * as AlertDialog from '@radix-ui/react-alert-dialog';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { CheckParamsJSON } from '../../types';
import { formatJsonString } from '../utilities/formatJsonString';

export const Dialog = ({
  inputButton,
  parsedJson,
  decompressedJson,
  setDecompressedJson,
  isEnableCheck,
}: {
  inputButton: React.ReactNode;
  parsedJson: Partial<CheckParamsJSON> | undefined;
  decompressedJson: string | undefined;
  setDecompressedJson: Dispatch<SetStateAction<string | undefined>>;
  isEnableCheck: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const handleCopyJson = async (decompressedJson: string | undefined) => {
    if (!decompressedJson) {
      return;
    }

    await navigator.clipboard.writeText(decompressedJson);
  };

  useEffect(() => {
    if (!parsedJson) {
      setDecompressedJson(undefined);
    }

    if (parsedJson && isEnableCheck) {
      const stringifiedJson = formatJsonString(parsedJson);
      setDecompressedJson(stringifiedJson);
      setOpen(true);
    }
  }, [parsedJson, setDecompressedJson, isEnableCheck]);

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>{inputButton}</AlertDialog.Trigger>
      {!!decompressedJson && (
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0" />
          <AlertDialog.Content
            className={twMerge(
              'w-[95%] md:w-4/5 lg:w-1/2 max-w-full p-2 xs:p-4 sm:p-6 md:p-8',
              'data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md break-words focus:outline-none',
              'bg-blueExtraDark text-lightGray border border-blueGray',
              'shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]'
            )}
          >
            <AlertDialog.Title className="flex justify-center mx-0 mb-1 text-[17px] font-medium uppercase">
              Decompressed URL:
            </AlertDialog.Title>
            <h3 className="flex justify-center text-sm">
              (Close this dialog to view errors)
            </h3>
            <AlertDialog.Description className="mt-4 mb-5 p-4 text-lightGray bg-blueDark leading-normal border border-blueGray rounded">
              {decompressedJson}
            </AlertDialog.Description>
            <div className="flex justify-end gap-[25px]">
              <AlertDialog.Cancel asChild>
                <button
                  onClick={() => handleCopyJson(decompressedJson)}
                  className={twMerge(
                    'w-full xs:w-[90%] sm:w-4/5 md:w-full lg:w-4/5',
                    'mt-4 mx-auto py-3 px-4 text-white bg-blueGray border-darkgray border-1 rounded-sm font-medium text-lg uppercase'
                  )}
                >
                  Copy JSON
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  className={twMerge(
                    'w-full xs:w-[90%] sm:w-4/5 md:w-full lg:w-4/5',
                    'mt-4 mx-auto py-3 px-4 text-white bg-blueGray border-darkgray border-1 rounded-sm font-medium text-lg uppercase'
                  )}
                >
                  Close
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      )}
    </AlertDialog.Root>
  );
};
