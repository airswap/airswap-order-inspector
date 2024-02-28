import { RequiredValues } from '../../types';

/* eslint-disable no-control-regex */
export const displayErrors = ({
  errorsList,
  requiredValues,
}: {
  errorsList: string[] | undefined;
  requiredValues: RequiredValues;
}): string[] | undefined => {
  // if contract returns no errors returned, return
  if (!errorsList) {
    return undefined;
  }

  // remove null values
  const filteredErrors = errorsList
    .filter((error) => {
      // regex checks for null values (x00...), which indicates no error
      const nullRegex = /^[\x00]+$/;
      return !nullRegex.test(error);
    })
    .map((error) => error.replace(/\x00/g, '').toLowerCase());

  const requiredValuesText = `
  Signature invalid. Double check the following values: domain chainId = ${requiredValues.domainChainId}, domain verifying contract: ${requiredValues.domainVerifyingContract}, domain name = ${requiredValues.domainName}, domain version = ${requiredValues.domainVersion}, protocolFee: ${requiredValues.protocolFee}`;

  const errorMessages = filteredErrors.map((error) => {
    if (
      error.includes(
        'unauthorized' || 'SignatoryUnauthorized' || 'Unauthorized'
      )
    ) {
      return requiredValuesText;
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
    } else {
      return `An unexpected error occured: ${error}`;
    }
  });

  return errorMessages;
};
