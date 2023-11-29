import { isAddress } from 'viem';
import { ChainIds, CheckParamsJSON } from '../../types';

export const validateJson = ({
  json,
  swapContractAddress = '0xd82FA167727a4dc6D6F55830A2c47aBbB4b3a0F8',
}: {
  json: Partial<CheckParamsJSON> | undefined;
  swapContractAddress?: string;
}): string[] | false => {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isNotValidNumberString = (value: string) => !/^\d+$/.test(value);
    const isBytes32 = (jsonKey: string) =>
      !/^(0x)?[0-9a-fA-F]{64}$/.test(jsonKey);
    const isUint8 = (v: string) =>
      !/^(0|[1-9]\d?|1\d\d|2[0-4]\d|25[0-5])$/.test(v);

    // Check for valid values
    if (json) {
      if (json['senderWallet'] && !isAddress(json['senderWallet'])) {
        errorsList.push('senderWallet must be a valid ERC20 address');
      }
      if (json['nonce'] && isNotValidNumberString(json['nonce'])) {
        errorsList.push(
          'nonce: must be a number. Make sure it\'s wrapped in quotation marks, e.g. "99"'
        );
      }
      if (json['expiry'] && isNotValidNumberString(json['expiry'])) {
        errorsList.push(
          'expiry: must be a number. Make sure it\'s wrapped in quotation marks, e.g. "1566941284"'
        );
      }
      if (json['signerWallet'] && !isAddress(json['signerWallet'])) {
        errorsList.push('signerWallet: must be a valid ERC20 address');
      }
      if (json['signerToken'] && !isAddress(json['signerToken'])) {
        errorsList.push('signerToken: must be a valid ERC20 address');
      }
      if (
        json['signerAmount'] &&
        isNotValidNumberString(json['signerAmount'])
      ) {
        errorsList.push(
          'signerAmount: must be a number. Make sure it\'s wrapped in quotation marks, e.g. "100000000"'
        );
      }
      if (json['senderToken'] && !isAddress(json['senderToken'])) {
        errorsList.push('senderToken: must be a valid ERC20 address');
      }
      if (
        json['senderAmount'] &&
        isNotValidNumberString(json['senderAmount'])
      ) {
        errorsList.push(
          'senderAmount: must be a number. Make sure it\'s wrapped in quotation marks, e.g. "100000000"'
        );
      }
      if (json['v'] && isUint8(json['v'])) {
        errorsList.push(`v: must be a value between 0-255.`);
      }
      if (json['r'] && isBytes32(json['r'])) {
        errorsList.push(
          `r: must be bytes32, a 64-character hex value, e.g. '0x1a2b...c9d0'.`
        );
      }
      if (json['s'] && isBytes32(json['s'])) {
        errorsList.push(
          `s: must be bytes32, a 64-character hex value, e.g. '0x4c1g...j4a0'.`
        );
      }
      if (json['chainId']) {
        const isValidChainId = Object.values(ChainIds).includes(
          Number(json['chainId'])
        );
        if (!isValidChainId) {
          errorsList.push(
            'chainId: must be a valid chain ID. Check deployed AirSwap contracts here: https://about.airswap.io/technology/deployments.'
          );
        }
      }
      if (json['swapContract'] && !isAddress(json['swapContract'])) {
        // first check if valid ERC20 address
        errorsList.push('swapContract: must be a valid ERC20 address');
        // then check if address is correct
        if (json['swapContract'] !== swapContractAddress) {
          errorsList.push(
            `swapContract: address is not valid. Check for deployed contracts on https://about.airswap.io/technology/deployments.`
          );
        }
      }
      if (json['protocolFee'] && json['protocolFee'] !== '7') {
        errorsList.push('protocolFee: input is not valid.');
      }
    }

    // Check for missing keys
    const missingKeys = requiredKeys.filter((key) => json && !json[key]);

    missingKeys.forEach((missingKey) => {
      errorsList.push(`JSON is missing an "${missingKey}" key and its value.`);
    });

    if (errorsList.length === 0) {
      // false means there are no errors here
      return false;
    } else {
      console.log(errorsList);
      return errorsList;
    }
  } catch (e) {
    console.error(e);
    errorsList.push(
      'An unexpected error occurred in the validateJson function.'
    );

    return errorsList;
  }
};
