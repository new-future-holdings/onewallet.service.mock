import { Rabbit } from './types';
declare type Game = {
    id: string;
    gameCode: string;
    gameType: string;
    vendor: string;
    details?: any[];
};
export declare function start(rabbit: Rabbit, games: Game[]): Promise<void>;
export declare function stop(): Promise<void>;
export {};
//# sourceMappingURL=vendor.d.ts.map