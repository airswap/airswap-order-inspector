import { SchemaValidationError } from '../../types';

/**
 *
 * @returns array with errors extracted from schemaValidationError input. If returns undefined, there are no errors
 */
export const formatSchemaValidationErrors = (
  schemaValidationError: SchemaValidationError
) => {
  if (!schemaValidationError) {
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
