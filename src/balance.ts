import R from 'ramda';
import { Rabbit } from './types';

let workers: any[];
export async function start(
  rabbit: Rabbit,
  balances: { account: string; available: number; total: number }[]
) {
  workers = await Promise.all([
    rabbit.createWorker('Balance.Query', async ({ type, data }) => {
      if (type === 'AvailableBalance') {
        return R.find(R.propEq('account', data.account))(balances) || null;
      }
    }),
    rabbit.createWorker('Balance.Command', async ({ type, data }) => {
      if (type === 'UpdateBalance') {
        const document = R.find(R.propEq('account', data.account))(balances);
        const balance = document.total + data.delta;
        document.available = balance;
        document.total = balance;
        return true;
      }
    }),
  ]);
}

export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}
