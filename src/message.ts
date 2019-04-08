import { Rabbit } from './types';

let workers: any[];

export async function start(rabbit: Rabbit) {

  workers = await Promise.all([
    rabbit.createWorker('Message.Query', async () => {
      return [];
    }),

    rabbit.createWorker('Message.Command', async () => {
      return true;
    }),
  ]);
}

export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}
