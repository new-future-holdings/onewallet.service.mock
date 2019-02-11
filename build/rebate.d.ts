import { Rabbit } from './types';
declare type Document = {
    account: string;
    available: number;
    lockedBalance: number;
    turnoverRequirement: number;
};
declare let rebates: Document[];
export { rebates };
export declare function start(rabbit: Rabbit, initialRebates: Document[]): Promise<void>;
export declare function stop(): Promise<void>;
//# sourceMappingURL=rebate.d.ts.map