import { Rabbit } from './types';
declare type Message = {
    id: string;
    admin: string;
    creator?: string;
    body: any;
    targetAccounts: string[];
    targetMemberLevels?: string[];
    dateTimeCreated: Date;
};
export declare function start(rabbit: Rabbit, initialMessages: Message[]): Promise<void>;
export declare function stop(): Promise<void>;
export {};
//# sourceMappingURL=message.d.ts.map