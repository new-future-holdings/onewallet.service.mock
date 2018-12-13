import AppError from 'onewallet.library.error';
interface IMeta {
  [key: string]: any;
}
export default class ResourceNotFoundError extends AppError<IMeta> {
  constructor(meta?: IMeta) {
    super('RESOURCE_NOT_FOUND', '', meta || {});
  }
}