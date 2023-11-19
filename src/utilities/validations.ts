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
      'senderWallet',
      'senderToken',
      'senderAmount',
      'v',
      'r',
      's',
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isNotValidNumberString = (value: string) => !/^\d+$/.test(value);

    // Check for valid values
    if (json) {
      if (json['senderWallet'] && !isAddress(json['senderWallet'])) {
        errorsList.push('senderWallet must be a valid ERC20 address');
      }
      if (json['nonce'] && isNotValidNumberString(json['nonce'])) {
        errorsList.push(
          'nonce must be a number. Make sure it\'s wrapped in quotation marks, e.g. "99"'
        );
      }
      if (json['expiry'] && isNotValidNumberString(json['expiry'])) {
        errorsList.push(
          'expiry must be a number. Make sure it\'s wrapped in quotation marks, e.g. "1566941284"'
        );
      }
      if (json['signerWallet'] && !isAddress(json['signerWallet'])) {
        errorsList.push('signerWallet must be a valid ERC20 address');
      }
      if (json['signerToken'] && !isAddress(json['signerToken'])) {
        errorsList.push('signerToken must be a valid ERC20 address');
      }
      if (
        json['signerAmount'] &&
        isNotValidNumberString(json['signerAmount'])
      ) {
        errorsList.push(
          'signerAmount must be a number. Make sure it\'s wrapped in quotation marks, e.g. "100000000"'
        );
      }
      if (json['senderToken'] && !isAddress(json['senderToken'])) {
        errorsList.push('senderToken must be a valid ERC20 address');
      }
      if (
        json['senderAmount'] &&
        isNotValidNumberString(json['senderAmount'])
      ) {
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
    console.log('errorsList', errorsList);

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
