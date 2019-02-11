import R from 'ramda';

import { Rabbit } from './types';

type Document = {
  account: string;
  available: number;
  lockedBalance: number;
  turnoverRequirement: number;
};

let workers: any[];
let rebates: Document[];

export { rebates as balances };

export async function start(rabbit: Rabbit, initialBalances: Document[]) {
  rebates = R.clone(initialBalances);

  workers = await Promise.all([
    rabbit.createWorker('Rebate.Query', async ({ type, data }) => {
      if (type === 'Rebate') {
        return (
          R.find(R.propEq('account', data.account))(rebates) || {
            account: data.account,
            available: 0,
            lockedBalance: 0,
            turnoverRequirement: 0,
          }
        );
      }
    }),

    rabbit.createWorker('Rebate.Command', async () => {
      return true;
    }),
  ]);
}

export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}