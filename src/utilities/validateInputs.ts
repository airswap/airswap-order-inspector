import { SetStateAction } from 'react';
import { InputType } from '../../types';
import { FullOrderERC20 } from '@airswap/types';

/**
 *
 * @returns True if input is valid, and False if input is invalid
 */
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
}): boolean | undefined => {
  if (!isEnableCheck) {
    return;
  }
  if (inputType === InputType.JSON) {
    if (!jsonString) {
      setErrors(['Input cannot be blank']);
      console.log('JSON input cannot be blank');
      return false;
    } else {
      try {
        JSON.parse(jsonString);
        return true;
      } catch (e) {
        setErrors(['Invalid JSON syntax. Please double check your input']);
        console.error(e);
        return false;
      }
    }
  } else if (inputType === InputType.URL) {
    if (!decompressedOrderFromUrl) {
      setErrors(['Input cannot be blank']);
      return false;
    } else {
      return true;
    }
  }
};
