import { ParsedJsonParams } from '../../types';

export const formatJsonString = (json: Partial<ParsedJsonParams>): string => {
  console.log('json', json);
  const stringifiedJson = JSON.stringify(json);
  console.log(stringifiedJson);
  let formattedJsonString = '';

  for (const current of stringifiedJson) {
    switch (current) {
      case '{':
        formattedJsonString += current + '\n';
        break;
      case '}':
        formattedJsonString += '\n' + current;
        break;
      case ',':
        formattedJsonString += current + '\n';
        break;
      default:
        formattedJsonString += current;
    }
  }

  return formattedJsonString;
};
