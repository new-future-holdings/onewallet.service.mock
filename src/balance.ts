import R from 'ramda';
import Big from 'big.js';

import { Rabbit } from './types';

type Document = {
  account: string;
  totalBalance: number;
  withdrawableBalance: number;
  totalTurnoverRequirement: number;
  currentTurnover: number;
};

let workers: any[];
let balances: Document[];

export { balances };

export async function start(rabbit: Rabbit, initialBalances: Document[]) {
  balances = R.clone(initialBalances);

  workers = await Promise.all([
    rabbit.createWorker('Balance.Query', async ({ type, data }) => {
      if (type === 'Balance') {
        return (
          R.find(R.propEq('account', data.account))(balances) || {
            account: data.account,
            totalBalance: 0,
            withdrawableBalance: 0,
            totalTurnoverRequirement: 0,
            currentTurnover: 0,
          }
        );
      }
    }),
    rabbit.createWorker('Balance.Command', async ({ type, data }) => {
      const document = R.find<Document>(R.propEq('account', data.account))(
        balances
      );

      if (!document) {
        return false;
      }

      if (type === 'Credit') {
        const balance = +new Big(document.totalBalance).add(data.amount);
        document.totalBalance = balance;
        document.withdrawableBalance = balance;
        return true;
      }

      if (type === 'Debit') {
        const balance = +new Big(document.totalBalance).sub(data.amount);
        document.totalBalance = balance;
        document.withdrawableBalance = balance;
        return true;
      }
      return true;
    }),
  ]);
}

export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}
