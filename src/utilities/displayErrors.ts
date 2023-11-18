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
    if (
      error.includes(
        'unauthorized' || 'SignatoryUnauthorized' || 'Unauthorized'
      )
    ) {
      return `Provided signature does not match the signerWallet. Double check signerWallet, "v", "r" and "s" values.`;
    } else if (error.includes('NonceAlreadyUsed')) {
      return `Nonce: the nonce entered is invalid.`;
    } else if (error.includes('expired')) {
      return `expiry: the date entered has expired.`;
    } else if (error.includes('senderallowance')) {
      return `senderAmount: the senderWallet has not approved the spending allowance of the senderToken.`;
    } else if (error.includes('senderbalance')) {
      return `senderAmount: the senderWallet does not have enough balance of the senderToken.`;
    } else if (error.includes('signerallowance')) {
      return `signerAmount: the signerWallet has not approved the spending allowance of the signerToken.`;
    } else if (error.includes('signerbalance')) {
      return `signerAmount: the signerWallet does not have enough balance of the signerToken.`;
    } else if (error.includes('signatureinvalid')) {
      return `v: ${error}`;
    }
  });

  return errorMessages;
};
