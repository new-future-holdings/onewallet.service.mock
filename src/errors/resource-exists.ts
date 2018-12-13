import AppError from 'onewallet.library.error';

export interface IMeta {
  [key: string]: any;
}

export default class ResourceExistsError extends AppError<IMeta> {
  constructor(meta?: IMeta) {
    super('RESOURCE_EXISTS', '', meta);
  }
}
