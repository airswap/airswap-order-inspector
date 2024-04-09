import { MdOutlineLibraryBooks } from 'react-icons/md';
import { FiXSquare } from 'react-icons/fi';
import { ReadContractErrorType } from 'viem';

/**
 * @remarks "Error State" view only shows if both `isCheckEnabled` and `orderParsingError` are truthy. Error state has "failed to load" state. "Empty state" only shows if `isCheckEnabled` is false
 * @param isCheckEnabled if this is false, then "Empty State" view should render
 * @param orderParsingError if truthy, this indicates a JSON syntax error and "Error State" view should render
 */
export const LoadingOrFailed = ({
  isCheckEnabled,
  orderParsingError,
  contractCallError,
}: {
  isCheckEnabled: boolean;
  orderParsingError: unknown;
  contractCallError: ReadContractErrorType | null;
}) => {
  const isShowLoadingState = !!orderParsingError && !!isCheckEnabled;
  const isEmptyState = !isCheckEnabled;
  const isContractReadError = !!isCheckEnabled && contractCallError;

  return (
    <>
      <div className="flex flex-col items-center justify-center my-20">
        <div
          id="circle"
          className="flex justify-center items-center h-[100px] w-[100px] bg-[#171A23] rounded-full"
        >
          {isShowLoadingState && <FiXSquare size={22} />}
          {isEmptyState && <MdOutlineLibraryBooks size={22} />}
        </div>
        <p className="mt-8 mb-4 font-bold text-white">
          {!isCheckEnabled && 'Load an order'}
          {isShowLoadingState && 'Failed to load'}
        </p>
        <p className="text-textDark">
          {/* TODO: test out `isContractReadError when there's a smart contract error */}
          {isContractReadError &&
            'There is an issue reading the smart contract'}
          {!isCheckEnabled && 'Load JSON or by URL'}
          {isShowLoadingState && 'Check your JSON or URL'}
        </p>
      </div>
    </>
  );
};
