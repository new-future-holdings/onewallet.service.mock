import { Rabbit, Event } from './types';
export declare function clearEvents(initialEvents: Event[]): void;
export declare function addEvent(data: Event): {
    id: string;
    timestamp: number;
    type: string;
    body: any;
    aggregateId: string;
    aggregateType: number;
    aggregateVersion: number;
};
export declare function startWorker(rabbit: Rabbit, initialEvents: Event[]): Promise<void>;
//# sourceMappingURL=eventstore.d.ts.map