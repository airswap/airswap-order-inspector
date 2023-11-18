/* eslint-disable no-control-regex */
export const displayErrors = (errorsList: string[] | undefined) => {
  if (!errorsList) {
    return;
  }

  // remove null values
  const filteredErrors = errorsList
    .filter((error) => {
      const nullRegex = /^[\x00]+$/;
      return !nullRegex.test(error);
    })
    .map((error) => error.replace(/\x00/g, '').toLowerCase());

  return filteredErrors;
};
