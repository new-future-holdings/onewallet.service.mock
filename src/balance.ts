import { Rabbit } from './types';

export async function startWorker(rabbit: Rabbit) {
  await rabbit.createWorker('Balance.Command', async () => true);
}