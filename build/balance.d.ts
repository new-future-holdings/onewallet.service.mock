import { Rabbit } from './types';
export declare function start(rabbit: Rabbit, balances: {
    account: string;
    available: number;
    total: number;
}[]): Promise<void>;
export declare function stop(): Promise<void>;
//# sourceMappingURL=balance.d.ts.map