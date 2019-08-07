import { Rabbit } from './types';
declare type Document = {
    account: string;
    totalBalance: number;
    withdrawableBalance: number;
    totalTurnoverRequirement: number;
    currentTurnover: number;
};
declare let balances: Document[];
export { balances };
export declare function start(rabbit: Rabbit, initialBalances: Document[]): Promise<void>;
export declare function stop(): Promise<void>;
//# sourceMappingURL=wallet.d.ts.map