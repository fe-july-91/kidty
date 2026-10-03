export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export const notFound = (message = 'Не знайдено') => new HttpError(404, message);
