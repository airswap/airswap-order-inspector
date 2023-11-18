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

  console.log(filteredErrors);

  const errorMessages = filteredErrors.map((error) => {
    if (error.includes('unauthorized')) {
      return `nonce: ${error}`;
    } else if (error.includes('expired')) {
      return `expiry: ${error}`;
    } else if (error.includes('senderallowance')) {
      return `senderAmount: ${error}`;
    } else if (error.includes('senderbalance')) {
      return `senderAmount: ${error}`;
    } else if (error.includes('signerallowance')) {
      return `signerAmount: ${error}`;
    } else if (error.includes('signerbalance')) {
      return `signerAmount: ${error}`;
    } else if (error.includes('signatureinvalid')) {
      return `v: ${error}`;
    }
  });

  return errorMessages;
};
