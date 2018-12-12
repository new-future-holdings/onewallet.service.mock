import R from 'ramda';

import { Rabbit } from './types';

let workers: any[];
export async function start(rabbit: Rabbit, accounts: any[]) {
  workers = await Promise.all([
    rabbit.createWorker('Account.Query', async ({ type, data }) => {
      if (type === 'Information') {
        return R.find(R.propEq('id', data.id))(accounts) || null;
      }
    }),
    rabbit.createWorker('Account.Command', async () => true),
  ]);
}

export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}
