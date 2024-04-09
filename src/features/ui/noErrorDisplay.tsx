import { FaCheck } from 'react-icons/fa';

type SchemaValidationError = {
  message: (string | number)[];
  error: string;
}[];

/**
 *
 * @returns component that tells user no errors are present
 */
export const NoErrorDisplay = ({
  formattedSchemaValidationErrors,
  orderErrors,
}: {
  formattedSchemaValidationErrors: SchemaValidationError | undefined;
  orderErrors: string[] | undefined;
}) => {
  const isNoErrors =
    !formattedSchemaValidationErrors &&
    (orderErrors?.length === 0 || !orderErrors);

  if (isNoErrors) {
    return (
      <div className="flex flex-col items-center justify-center m-auto h-full -mt-10 text-center text-wrap">
        <div
          id="circle"
          className="flex justify-center items-center h-[100px] w-[100px] bg-[#171A23] rounded-full"
        >
          <FaCheck size={22} />
        </div>
        <p className="mt-8 mb-4 font-bold text-white">Ready to swap</p>
        <p className="text-textDark">
          There were no issues found with your order
        </p>
      </div>
    );
  } else {
    return;
  }
};
