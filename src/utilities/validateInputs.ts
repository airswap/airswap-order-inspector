import { SetStateAction } from 'react';
import { InputType } from '../../types';
import { FullOrderERC20 } from '@airswap/types';

export const validateInputs = ({
  isEnableCheck,
  inputType,
  jsonString,
  setErrors,
  decompressedOrderFromUrl,
}: {
  isEnableCheck: boolean;
  inputType: InputType;
  jsonString: string | undefined;
  setErrors: (value: SetStateAction<string[]>) => void;
  decompressedOrderFromUrl: FullOrderERC20 | undefined;
}) => {
  if (!isEnableCheck) {
    return;
  }

  if (inputType === InputType.JSON) {
    if (!jsonString) {
      setErrors(['Input cannot be blank']);
      return false;
    }

    try {
      JSON.parse(jsonString);
    } catch (e) {
      setErrors(['Invalid JSON syntax. Please double check your input']);
    }
  } else if (inputType === InputType.URL) {
    if (!decompressedOrderFromUrl) {
      setErrors(['Input cannot be blank']);
      return true;
    }
  }
};
