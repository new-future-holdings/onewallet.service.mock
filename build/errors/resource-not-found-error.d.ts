import AppError from 'onewallet.library.error';
interface IMeta {
    [key: string]: any;
}
export default class ResourceNotFoundError extends AppError<IMeta> {
    constructor(meta?: IMeta);
}
export {};
//# sourceMappingURL=resource-not-found-error.d.ts.map