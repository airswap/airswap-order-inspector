import { SchemaValidationError } from '../../types';

/**
 *
 * @returns array with errors extracted from schemaValidationError input
 */
export const useFormatSchemaValidationErrors = (
  schemaValidationError: SchemaValidationError
) => {
  if (!schemaValidationError) {
    console.log('invalid schema');
    return;
  } else {
    const issues = Object.entries(schemaValidationError.issues);
    const separateIssues = issues.map((issue) => {
      const message = issue[1].path;
      const error = issue[1].message;
      return {
        message: message,
        error: error,
      };
    });

    return separateIssues;
  }
};
