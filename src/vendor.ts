import R from 'ramda';

import { Rabbit } from './types';

type Game = {
  id: string;
  gameCode: string;
  gameType: string;
  vendor: string;
  details?: any[];
};

let workers: any[];
export async function start(rabbit: Rabbit, games: Game[]) {
  workers = await Promise.all([
    rabbit.createWorker('Vendor.Query', async ({ type, data }) => {
      if (type === 'Game') {
        return (
          R.find<Game>(
            game =>
              game.vendor === data.vendor && game.gameCode === data.gameCode
          )(games) || null
        );
      }
    }),
  ]);
}

export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}
