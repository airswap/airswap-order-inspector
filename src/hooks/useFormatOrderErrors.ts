export const useFormatOrderErrors = (
  orderErrors: string[] | undefined
): string[] | undefined => {
  if (!orderErrors || orderErrors.length === 0) {
    return undefined;
  }

  const formattedErrors = orderErrors.map((error) => {
    // eslint-disable-next-line no-control-regex
    const cleanedError = error.replace(/\x00/g, '');
    return cleanedError.trim();
  });

  return formattedErrors;
};
