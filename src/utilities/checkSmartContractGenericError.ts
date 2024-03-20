import { Dispatch, SetStateAction } from 'react';
import { ReadContractErrorType } from 'viem';

/**
 *
 * @param errorCheck takes in a return value from Wagmi useContractRead function for `check` function
 * @returns generic error if contract returns an otherwise unhelpful error
 */
export const checkSmartContractGenericError = ({
  errorCheck,
  setErrors,
}: {
  errorCheck: ReadContractErrorType | null;
  setErrors: Dispatch<SetStateAction<string[]>>;
}) => {
  if (
    errorCheck?.message.includes('unknown') ||
    errorCheck?.message.includes('reverted')
  ) {
    const unknownError =
      'Unknown error from SwapERC20 contract. Please double check all your inputs';

    let uniqueErrors: string[] | [] = [];

    setErrors((prevErrors) => {
      const updatedErrors = [unknownError, ...prevErrors];
      uniqueErrors = [...new Set(updatedErrors)];
      return uniqueErrors;
    });

    return uniqueErrors;
  }
};
