export interface WorkerOptions {
    concurrency?: number;
}
export declare type Event<T = any> = Readonly<{
    id: string;
    type: string;
    body: T;
    aggregateId: string;
    aggregateType: number;
    aggregateVersion: number;
    timestamp: number;
}>;
export interface Rabbit {
    createPublisher: (...arg: any[]) => Promise<(topic: string, ...args: any[]) => Promise<any>>;
    createWorker: (scope: string, handler: (...args: Array<any>) => Promise<any>, options?: WorkerOptions) => Promise<any>;
}
export declare type Pagination<T> = {
    first?: number;
    after?: string;
    filter: T;
};
export declare type Language = 'en' | 'zh' | 'zh-Hant' | 'zh-Hans';
//# sourceMappingURL=types.d.ts.map