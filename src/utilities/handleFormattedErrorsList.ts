import { formatErrorsList } from './formatErrorsList';

export const handleFormattedListErrors = ({
  errorsList,
  setErrors,
}: {
  errorsList: string[] | undefined;
  setErrors: (value: React.SetStateAction<string[]>) => void;
}) => {
  if (!errorsList) {
    return;
  }

  const formattedErrorsList = formatErrorsList(errorsList);

  if (formattedErrorsList && formattedErrorsList.length > 0) {
    setErrors((prevErrors) => {
      const updatedErrors = [...prevErrors, ...formattedErrorsList];
      const uniqueErrors = [...new Set(updatedErrors)];
      return uniqueErrors;
    });
  }
};
