import AppError from 'onewallet.library.error';
export default class InvalidRequestError extends AppError {
  constructor(message: string, meta?: {}) {
    super('INVALID_REQUEST', message, meta);
  }
}