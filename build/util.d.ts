export declare function generateId(prefix?: string, uuid?: string): string;
export declare function generateEventId(): string;
export declare function generateFakeEvent(params: {
    type: string;
    id?: string;
    timestamp?: number;
    aggregateId?: string;
    aggregateType?: number;
    aggregateVersion?: number;
    body?: any;
}): {
    type: string;
    id?: string | undefined;
    timestamp?: number | undefined;
    aggregateId?: string | undefined;
    aggregateType?: number | undefined;
    aggregateVersion?: number | undefined;
    body?: any;
} & {
    id: string;
    timestamp: number;
    aggregateId: string;
    aggregateType: number;
    aggregateVersion: number;
    body: {};
};
//# sourceMappingURL=util.d.ts.map