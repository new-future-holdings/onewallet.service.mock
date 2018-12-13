import AppError from 'onewallet.library.error';
interface Meta {
    [key: string]: any;
}
export default class ResourceNotFoundError extends AppError<Meta> {
    constructor(meta?: Meta);
}
export {};
//# sourceMappingURL=resource-not-found-error.d.ts.map