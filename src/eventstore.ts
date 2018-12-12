import R from 'ramda';

import { Rabbit, Event } from './types';
import { generateEventId } from './util';

let events: Event[] = [];

export function clearEvents(initialEvents: Event[]) {
  events = initialEvents || [];
}

export function addEvent(data: Event) {
  const event = {
    ...data,
    id: generateEventId(),
    timestamp: Date.now(),
  };

  events.push(event);
  return event;
}

export { events };

let worker: any;
export async function start(rabbit: Rabbit, initialEvents: Event[]) {
  const publish = await rabbit.createPublisher('OneWallet');
  events = R.clone(initialEvents);

  worker = await rabbit.createWorker('EventStore', async ({ type, data }) => {
    if (type === 'Events') {
      return R.filter((event: Event) => {
        if (data.aggregateId) {
          return (
            event.aggregateType === data.aggregateType &&
            event.aggregateId === data.aggregateId
          );
        }

        if (data.aggregateTypes) {
          return R.contains(event.aggregateType)(data.aggregateTypes);
        }

        return event.aggregateType === data.aggregateType;
      })(events);
    }

    if (type === 'CreateEvent') {
      const event = addEvent(data);

      await publish(`${data.aggregateType}.${data.aggregateId}`, event);
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
