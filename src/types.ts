
export interface WorkerOptions {
  concurrency?: number;
}

export type Event<TBody = any> = Readonly<{
  id: string;
  type: string;
  body: TBody;
  aggregateId: string;
  aggregateType: number;
  aggregateVersion: number;
  timestamp: number;
}>;

export interface Rabbit {
  createPublisher: (...arg: any[]) => Promise<(topic: string, ...args: any[]) => Promise<any>>;
  createWorker: (
    scope: string,
    handler: ((...args: Array<any>) => Promise<any>),
    options?: WorkerOptions,
  ) => Promise<any>;
}
