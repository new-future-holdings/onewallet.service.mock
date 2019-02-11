import { Rabbit } from './types';
declare type Document = {
    account: string;
    available: number;
    lockedBalance: number;
    turnoverRequirement: number;
};
declare let rebates: Document[];
export { rebates as balances };
export declare function start(rabbit: Rabbit, initialBalances: Document[]): Promise<void>;
export declare function stop(): Promise<void>;
//# sourceMappingURL=rebate.d.ts.map