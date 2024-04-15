import { MdOutlineLibraryBooks } from 'react-icons/md';
import { FiXSquare } from 'react-icons/fi';
import { ReadContractErrorType } from 'viem';
import { useEffect, useState } from 'react';

export const LoadingOrFailed = ({
  orderText,
  orderParsingError,
  contractCallError,
}: {
  orderText: string | undefined;
  orderParsingError: unknown;
  contractCallError: ReadContractErrorType | null;
}) => {
  const [isContractErrors, setIsContractErrors] = useState<boolean | undefined>(
    undefined
  );
  useEffect(() => {
    contractCallError ? setIsContractErrors(true) : setIsContractErrors(false);
  }, [contractCallError]);

  return (
    <>
      <div className="flex flex-col items-center justify-center my-20">
        <div className="flex justify-center items-center h-[100px] w-[100px] bg-[#171A23] rounded-full">
          {orderParsingError ? (
            <FiXSquare size={22} />
          ) : (
            <MdOutlineLibraryBooks size={22} />
          )}
        </div>
        <p className="mt-8 mb-4 font-bold text-white">
          {!orderText && 'Load an order'}
          {!!orderParsingError && 'Failed to load'}
        </p>
        <p className="text-textDark">
          {isContractErrors
            ? 'There is an issue reading the smart contract'
            : orderParsingError
              ? 'Check your JSON or URL'
              : 'Load JSON or by URL'}
        </p>
      </div>
    </>
  );
};
