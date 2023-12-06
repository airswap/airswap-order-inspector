// import { RequiredValues } from '../../types';

// export const formatErrorsList = ({
//   errorsList,
//   requiredValues,
// }: {
//   errorsList: string[] | undefined;
//   requiredValues: RequiredValues;
// }) => {
//   if (!errorsList) {
//     return;
//   }

//   const valuesRequired = `
//     domain chainId = ${requiredValues.domainChainId}
//     domain verifyingContract: ${requiredValues.domainVerifyingContract}
//     domain name = ${requiredValues.domainName}
//     domain version = ${requiredValues.domainVersion}
//     protocolFee: ${requiredValues.protocolFee}
//     `;

//   const mutatedErrors = errorsList;

//   for (let i = 0; i < mutatedErrors.length; i++) {
//     const error = mutatedErrors[i];
//     if (
//       error.includes('Signature invalid') ||
//       error.includes('signatureinvalid')
//     ) {
//       mutatedErrors[i] = mutatedErrors[i] + valuesRequired;
//     }
//   }

//   return mutatedErrors;
// };

export const formatErrorsList = (errorsList: string[] | undefined) => {
  const formattedErrorsList = errorsList?.flatMap((error) => {
    const splitError = error.split('\n');
    const trimmedLines = splitError
      .map((line) => line.trim())
      .filter((line) => line !== '');

    return trimmedLines;
  });

  return formattedErrorsList;
};
