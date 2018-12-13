import AppError from 'onewallet.library.error';
export interface IMeta {
    [key: string]: any;
}
export default class ResourceExistsError extends AppError<IMeta> {
    constructor(meta?: IMeta);
}
//# sourceMappingURL=resource-exists.d.ts.map