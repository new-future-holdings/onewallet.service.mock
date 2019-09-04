import R from 'ramda';

import { Rabbit, Event } from './types';
import { generateFakeEventId } from './util';

let events: Event[] = [];

export function clearEvents(initialEvents: Event[]) {
  events = initialEvents || [];
}

export function addEvent(data: Event) {
  const event = {
    ...data,
    id: generateFakeEventId(),
    timestamp: Date.now(),
  };
  events.push(event);
  return event;
}

let publish: (event: Event) => Promise<void>;

export { events, publish };

let worker: any;
export async function start(rabbit: Rabbit, initialEvents: Event[]) {
  const publisher = await rabbit.createPublisher('OneWallet');
  publish = (event: Event) =>
    publisher(`${event.aggregateType}.${event.type}`, event);

  events = R.clone(initialEvents);

  worker = await rabbit.createWorker('EventStore', async ({ type, data }) => {
    if (type === 'Events') {
      const conditions: any[] = [];

      if (data.aggregateType) {
        conditions.push(R.propEq('aggregateType', data.aggregateType));
      }

      if (data.aggregateTypes) {
        conditions.push((event: Event) =>
          R.contains(event.aggregateType)(data.aggregateTypes)
        );
      }

      if (data.aggregateId) {
        conditions.push(R.propEq('aggregateId', data.aggregateId));
      }

      if (data.sinceId) {
        conditions.push(
          R.propSatisfies((value: string) => value > data.sinceId, 'id')
        );
      }

      if (!R.isNil(data.sinceAggregateVersion)) {
        conditions.push(
          R.propSatisfies(
            (value: string) => value > data.sinceAggregateVersion,
            'aggregateVersion'
          )
        );
      }

      return R.compose<Event[], Event[], Event[]>(
        R.take(100),
        R.filter(R.allPass(conditions))
      )(events);
    }

    if (type === 'CreateEvent') {
      const event = addEvent(data);

      await publish(event);
      return event;
    }

    if (type === 'Snapshot') {
      return null;
    }
  });
}

export async function stop() {
  await worker.stop();
}
