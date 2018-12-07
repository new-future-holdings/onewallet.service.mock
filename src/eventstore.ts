import * as R from 'ramda';
import { Rabbit, Event } from './types';
import { generateId } from './util';

let events: Event[] = [];

export function clearEvents(initialEvents: Event[]) {
  events = initialEvents || [];
}

export function addEvent(data: Event) {
  const event = {
    ...data,
    id: generateId('evn').slice(0, 27),
    timestamp: Date.now(),
  };

  events.push(event);
  return event;
}

export async function startWorker(rabbit: Rabbit, initialEvents: Event[]) {
  const publish = await rabbit.createPublisher('OneWallet');
  events = R.clone(initialEvents);

  await rabbit.createWorker('EventStore', async ({ type, data }) => {
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

      const result = R.filter(R.allPass(conditions))(events);

      events = R.filter(R.complement(R.allPass(conditions)))(events);

      return result;
    }

    if (type === 'CreateEvent') {
      const event = {
        ...data,
        id: generateId('evn').slice(0, 27),
        timestamp: Date.now(),
      };
      events.push(event);

      await publish(`${data.aggregateType}.${data.aggregateId}`, event);
      return event;
    }
  });
}
