import R from 'ramda';

import { Rabbit } from './types';

type Document = { account: string; available: number; total: number };

let workers: any[];
let balances: Document[];

export { balances };

export async function start(rabbit: Rabbit, initialBalances: Document[]) {
  balances = R.clone(initialBalances);

  workers = await Promise.all([
    rabbit.createWorker('Balance.Query', async ({ type, data }) => {
      if (type === 'AvailableBalance') {
        return R.find(R.propEq('account', data.account))(balances) || null;
      }
    }),
    rabbit.createWorker('Balance.Command', async ({ type, data }) => {
      if (type === 'UpdateBalance') {
        const document = R.find(R.propEq('account', data.account))(balances);
        if (!document) {
          return false;
        }
        const balance = document.total + data.delta;
        document.available = balance;
        document.total = balance;
        return true;
      }
      return true;
    }),
  ]);
}

export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}
