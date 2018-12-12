import { Rabbit } from './types';
declare type Document = {
    account: string;
    available: number;
    total: number;
};
declare let balances: Document[];
export { balances };
export declare function start(rabbit: Rabbit, initialBalances: Document[]): Promise<void>;
export declare function stop(): Promise<void>;
//# sourceMappingURL=balance.d.ts.map