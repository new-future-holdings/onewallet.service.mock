import * as R from 'ramda';
import { Rabbit, Event } from './types';
import { generateId } from './util';
let events: Event[] = [];

export function clearEvents() {
  events = [];
}

export async function startWorker(rabbit: Rabbit) {
  const publish = await rabbit.createPublisher('OneWallet');
  await rabbit.createWorker('EventStore', async ({ type, data }) => {
    if (type === 'Events') {
      return R.filter((event: Event) => {
        if (data.aggregateId) {
          return (
            event.aggregateType === data.aggregateType &&
            event.aggregateId === data.aggregateId
          );
        }

        return event.aggregateType === data.aggregateType;
      })(events);
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
