import { isAddress } from 'viem';
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

    // Check that the type of each value is valid
    if (json) {
      if (json['senderWallet'] && !isAddress(json['senderWallet'])) {
        return 'senderWallet must be a valid ERC20 address';
      } else if (json['nonce'] && isNaN(json['nonce'])) {
        return 'nonce must be a number. Make sure it\'s wrapped in quotation marks, e.g. "99"';
      } else if (json['expiry'] && isNaN(json['expiry'])) {
        return 'expiry must be a number. Make sure it\'s wrapped in quotation marks, e.g. "1566941284"';
      } else if (json['signerWallet'] && !isAddress(json['signerWallet'])) {
        return 'signerWallet must be a valid ERC20 address';
      } else if (json['signerToken'] && !isAddress(json['signerToken'])) {
        return 'signerToken must be a valid ERC20 address';
      } else if (json['signerAmount'] && !isNaN(Number(json['signerAmount']))) {
        return 'signerAmount must be a valid ERC20 address';
      } else if (json['senderToken'] && !isAddress(json['senderToken'])) {
        return 'senderToken must be a valid ERC20 address';
      } else if (json['senderAmount'] && !isNaN(Number(json['senderAmount']))) {
        return 'senderAmount must be a valid ERC20 address';
      } else if (json['v'] && !isNaN(json['v'])) {
        ('v must be a number. Make sure it\'s wrapped in quotation marks, e.g. "29"');
      } else if (json['r'] && typeof json['r'] === 'string') {
        ('v must be a string. Make sure it\'s wrapped in quotation marks, e.g. "0x67e0723b0afd357d4f28523bf633dfee16e0eab2f3cbcf8ce1afd32a035d2764"');
      } else if (json['s'] && typeof json['s'] === 'string') {
        ('s must be a string. Make sure it\'s wrapped in quotation marks, e.g. "0x67e0723b0afd357d4f28523bf633dfee16e0eab2f3cbcf8ce1afd32a035d2764"');
      }
    }
    // Check for missing keys
    const missingKeys = requiredKeys.filter((key) => json && !json[key]);

    if (missingKeys.length === 0) {
      return false; // No errors
    }

    // console.log(missingKeys, 'missingKeys');

    const errorString = `Your JSON is missing the following keys: ${missingKeys.join(
      ', '
    )}.`;
    console.error(errorString);
    return errorString;
  } catch (e) {
    console.error(e);
    return 'An unexpected error occurred in the validateJsonShape function.';
  }
};
