import { checkParamsJSON } from '../../types';

export const validateJsonShape = (
  json: Partial<checkParamsJSON> | undefined
): string | boolean => {
  try {
    const requiredKeys: (keyof checkParamsJSON)[] = [
      'senderWallet',
      'nonce',
      'expiry',
      'signerWallet',
      'signerToken',
      'signerAmount',
      'senderToken',
      'senderAmount',
      'v',
      'r',
      's',
    ];

    // Check for missing keys
    const missingKeys = requiredKeys.filter((key) => json && !json[key]);

    if (missingKeys.length === 0) {
      return true; // No errors
    }

    console.log(missingKeys, 'missingKeys');

    const errorString = `Your JSON is missing the following keys: ${missingKeys.join(
      ', '
    )}.`;
    console.error(errorString);
    return errorString;
  } catch (e) {
    console.error(e);
    return 'An unexpected error occurred during validation.';
  }
};
