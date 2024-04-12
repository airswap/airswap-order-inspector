import { MdOutlineLibraryBooks } from 'react-icons/md';
import { FiXSquare } from 'react-icons/fi';
import { ReadContractErrorType } from 'viem';

export const LoadingOrFailed = ({
  orderParsingError,
  contractCallError,
}: {
  orderParsingError: unknown;
  contractCallError: ReadContractErrorType | null;
}) => {
  const isShowLoadingState = !!orderParsingError;
  const isContractReadError = contractCallError;

  return (
    <>
      <div className="flex flex-col items-center justify-center my-20">
        <div className="flex justify-center items-center h-[100px] w-[100px] bg-[#171A23] rounded-full">
          {isShowLoadingState ? (
            <FiXSquare size={22} />
          ) : (
            <MdOutlineLibraryBooks size={22} />
          )}
        </div>
        <p className="mt-8 mb-4 font-bold text-white">
          {isShowLoadingState ? 'Failed to load' : 'Load an order'}
        </p>
        <p className="text-textDark">
          {/* TODO: test out `isContractReadError when there's a smart contract error */}
          {isContractReadError &&
            'There is an issue reading the smart contract'}
          {/* TODO: Double check this */}
          {isShowLoadingState
            ? 'Check your JSON or URL'
            : 'Load JSON or by URL'}
        </p>
      </div>
    </>
  );
};
