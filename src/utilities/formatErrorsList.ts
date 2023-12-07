export const formatErrorsList = (errorsList: string[] | undefined) => {
  const formattedErrorsList = errorsList?.flatMap((error) => {
    const splitError = error.split('\n');
    const trimmedLines = splitError
      .map((line) => line.trim())
      .filter((line) => line !== '');

    return trimmedLines;
  });

  return formattedErrorsList;
};
