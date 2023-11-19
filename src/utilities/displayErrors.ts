/* eslint-disable no-control-regex */
export const displayErrors = (
  errorsList: string[] | undefined
): string[] | undefined => {
  // if no errors are returned from the contract, return
  if (!errorsList) {
    return undefined;
  }

  // remove null values
  const filteredErrors = errorsList
    .filter((error) => {
      const nullRegex = /^[\x00]+$/;
      return !nullRegex.test(error);
    })
    .map((error) => error.replace(/\x00/g, '').toLowerCase());

  const errorMessages = filteredErrors.map((error) => {
    if (
      error.includes(
        'unauthorized' || 'SignatoryUnauthorized' || 'Unauthorized'
      )
    ) {
      return `Provided signature does not match. Double check your values for: "signerWallet", "v", "r" and "s".`;
    }
    if (error.includes('NonceAlreadyUsed')) {
      return `Nonce: the nonce entered is invalid.`;
    }
    if (error.includes('expired')) {
      return `expiry: the date entered has expired.`;
    }
    if (error.includes('senderallowance')) {
      return `senderAmount: the senderWallet has not approved the spending allowance of the senderToken.`;
    }
    if (error.includes('senderbalance')) {
      return `senderAmount: the senderWallet does not have enough balance of the senderToken.`;
    }
    if (error.includes('signerallowance')) {
      return `signerAmount: the signerWallet has not approved the spending allowance of the signerToken.`;
    }
    if (error.includes('signerbalance')) {
      return `signerAmount: the signerWallet does not have enough balance of the signerToken.`;
    }
    {
      return `An unexpected error occured: ${error}`;
    }
  });

  return errorMessages;
};
