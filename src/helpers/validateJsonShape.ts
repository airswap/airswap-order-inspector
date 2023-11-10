// check if JSON takes the shape of checkParamsJSON
export const validateJsonShape = (json: any) => {
  if (
    json.senderWallet &&
    json.nonce &&
    json.expiry &&
    json.signerWallet &&
    json.signerToken &&
    json.signerAmount &&
    json.senderToken &&
    json.senderAmount &&
    json.v &&
    json.r &&
    json.s
  ) {
    return 'noErrors';
  } else {
    const errorString = 'Your JSON object is missing the following keys: ';

    // assume all keys are missing
    const missingKeys: { [k: string]: boolean } = {
      senderWallet: true,
      nonce: true,
      expiry: true,
      signerWallet: true,
      signerToken: true,
      signerAmount: true,
      senderToken: true,
      senderAmount: true,
      v: true,
      r: true,
      s: true,
    };
    // if key is present, set to false
    for (const key in json) {
      missingKeys[key] = false;
    }
    // if key is still missing, add to array
    const missingKeysArray = [];
    for (const key in missingKeys) {
      if (missingKeys[key]) {
        missingKeysArray.push(key);
      }
    }

    missingKeysArray.forEach((missingKey) => {
      if (missingKeysArray.length > 1) {
        errorString.concat(`, ${missingKey}`);
      } else {
        errorString.concat(missingKey);
      }
    });

    return errorString;
  }
};
