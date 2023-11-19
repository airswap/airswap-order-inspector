import { isAddress } from 'viem';
import { CheckParamsJSON } from '../../types';

export const validateJson = (
  json: Partial<CheckParamsJSON> | undefined
): string[] | false => {
  const errorsList: string[] = [];
  try {
    const requiredKeys: (keyof CheckParamsJSON)[] = [
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

    // Check for valid values
    if (json) {
      if (json['senderWallet'] && !isAddress(json['senderWallet'])) {
        errorsList.push('senderWallet must be a valid ERC20 address');
      } else if (json['nonce'] && isNaN(json['nonce'])) {
        errorsList.push(
          'nonce must be a number. Make sure it\'s wrapped in quotation marks, e.g. "99"'
        );
      } else if (json['expiry'] && isNaN(json['expiry'])) {
        errorsList.push(
          'expiry must be a number. Make sure it\'s wrapped in quotation marks, e.g. "1566941284"'
        );
      } else if (json['signerWallet'] && !isAddress(json['signerWallet'])) {
        errorsList.push('signerWallet must be a valid ERC20 address');
      } else if (json['signerToken'] && !isAddress(json['signerToken'])) {
        errorsList.push('signerToken must be a valid ERC20 address');
      } else if (json['signerAmount'] && isNaN(Number(json['signerAmount']))) {
        errorsList.push(
          'signerAmount must be a number. Make sure it\'s wrapped in quotation marks, e.g. "100000000"'
        );
      } else if (json['senderToken'] && !isAddress(json['senderToken'])) {
        errorsList.push('senderToken must be a valid ERC20 address');
      } else if (json['senderAmount'] && isNaN(Number(json['senderAmount']))) {
        errorsList.push(
          'senderAmount must be a number. Make sure it\'s wrapped in quotation marks, e.g. "100000000"'
        );
      }
    }

    // Check for missing keys
    const missingKeys = requiredKeys.filter((key) => json && !json[key]);

    missingKeys.forEach((missingKey) => {
      errorsList.push(`Your JSON is missing a ${missingKey} key`);
    });

    if (errorsList.length === 0) {
      // false means there are no errors here
      return false;
    } else {
      return errorsList;
    }
  } catch (e) {
    console.error('console error', e);
    errorsList.push(
      'An unexpected error occurred in the validateJson function.'
    );
    return errorsList;
  }
};
