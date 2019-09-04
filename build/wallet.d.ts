import { Rabbit } from './types';
declare type Document = {
    account: string;
    balance: number;
};
export declare function start(rabbit: Rabbit, initial: Document[]): Promise<void>;
export declare function stop(): Promise<void>;
export {};
//# sourceMappingURL=wallet.d.ts.map