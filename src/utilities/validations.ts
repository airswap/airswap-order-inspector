import { isAddress } from 'viem';
import { CheckParamsJSON } from '../../types';

export const validateJson = (
  json: Partial<CheckParamsJSON> | undefined
): string[] | false => {
  try {
    const errorsList: string[] = [];

    const requiredKeys: (keyof CheckParamsJSON)[] = [
      'nonce',
      'expiry',
      'signerWallet',
      'signerToken',
      'signerAmount',
      // 'senderWallet',
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
      // else if (json['v'] && isNaN(Number(json['v']))) {
      //   errorsList.push('v must be a number. Make sure it\'s wrapped in quotation marks, e.g. "28"');
      // } else if (json['r'] && typeof json['r'] === 'string') {
      //   errorsList.push('r must be a hash in string format, e.g. "0x67e0723b0afd3..."');
      // } else if (json['s'] && typeof json['s'] === 'string') {
      //   errorsList.push('s must be a hash in string format, e.g. "0x67e0723b0afd3..."');
      // }
    }

    // Check for missing keys
    const missingKeys = requiredKeys.filter((key) => json && !json[key]);

    missingKeys.forEach((missingKey) => {
      errorsList.push(`Your JSON is missing ${missingKey}`);
    });

    if (errorsList.length === 0) {
      return false;
    } else {
      return errorsList;
    }
  } catch (e) {
    console.error(e);
    return ['An unexpected error occurred in the validateJson function.'];
  }
};
