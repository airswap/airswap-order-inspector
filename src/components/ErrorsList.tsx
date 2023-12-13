export const renderErrors = ({ errors }: { errors: string[] }) => {
  const errorsArray = errors?.map((error, i) => {
    return (
      <li
        key={error + i}
        className="flex max-w-full ml-2 mb-2 text-left last:mb-0"
      >
        <input type="checkbox" className="flex self-start w-4 mr-2 mt-1.5" />
        <span className="flex">{error}</span>
      </li>
    );
  });
  return errorsArray;
};
