/**
 * An error with a stable `code` the frontend translates. `message` is an
 * English fallback for logs and API clients.
 */
export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string
  ) {
    super(message);
  }
}

export const notFound = (code = 'notFound', message = 'Not found') =>
  new HttpError(404, code, message);

/** Codes used as zod error messages in lib/schemas.ts. */
export const VALIDATION_CODES = new Set([
  'invalidEmail',
  'passwordRequired',
  'passwordTooShort',
  'passwordTooLong',
  'passwordsMismatch',
  'nameRequired',
  'nameTooLong',
  'invalidBirthDate',
  'genderRequired',
  'invalidMonth',
  'valueTooSmall',
  'valueTooLarge',
  'unknownVaccine',
  'invalidVaccinationDate',
  'messageRequired',
  'messageTooLong',
]);
