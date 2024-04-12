import { addSpacesBeforeUppercase } from '@/utils/addSpaceBeforeUppercase';
import { FaExclamation } from 'react-icons/fa';
import { ReadContractErrorType } from 'viem';

type SchemaValidationError = {
  message: (string | number)[];
  error: string;
}[];

export const FormattedErrors = ({
  formattedSchemaValidationErrors,
  orderErrors,
  eip721DomainStatus,
  contractCallError,
}: {
  formattedSchemaValidationErrors: SchemaValidationError | undefined;
  orderErrors: string[] | undefined;
  eip721DomainStatus: 'success' | 'failure' | undefined;
  contractCallError: ReadContractErrorType | null;
}) => {
  if (contractCallError) {
    return (
      <div className="flex flex-row my-4" key={contractCallError.shortMessage}>
        <div className="p-3 h-1/2 rounded-full border">
          <FaExclamation size={12} />
        </div>
        <div className="flex flex-col ml-4 text-[13px]">
          <p className="mb-1.5 font-bold">{contractCallError.shortMessage}</p>
          <p className="text-textDark font-normal">
            {contractCallError.shortMessage}
          </p>
        </div>
      </div>
    );
  } else if (formattedSchemaValidationErrors) {
    return formattedSchemaValidationErrors?.map((error) => {
      return (
        <div className="flex flex-row my-4" key={error.message.toString()}>
          <div className="p-3 h-1/2 rounded-full border">
            <FaExclamation size={12} />
          </div>
          <div className="flex flex-col ml-4 text-[13px]">
            <p className="mb-1.5 font-bold">{error.message}</p>
            <p className="text-textDark font-normal">{error.error}</p>
          </div>
        </div>
      );
    });
  } else if (orderErrors && orderErrors.length > 0) {
    return orderErrors?.map((error) => {
      return (
        <div className="flex flex-row my-4" key={error}>
          <div className="p-3 h-1/2 rounded-full border">
            <FaExclamation size={12} />
          </div>
          <div className="flex flex-col ml-4 text-[13px]">
            <p className="mb-1.5 font-bold">
              {addSpacesBeforeUppercase(error)}
            </p>
            <p className="text-textDark font-normal">{error}</p>
          </div>
        </div>
      );
    });
  } else if (eip721DomainStatus === 'failure') {
    return (
      <div className="flex flex-row my-4 text-wrap">
        <div className="p-3 h-1/2 rounded-full border">
          <FaExclamation size={12} />
        </div>
        <div className="flex flex-col ml-4 text-[13px]">
          <p className="mb-1.5 font-bold">swapContract</p>
          <p className="text-textDark font-normal">
            Error reading eip721Domain smart contract function. Double check
            your contract address
          </p>
        </div>
      </div>
    );
  } else {
    return undefined;
  }
};
