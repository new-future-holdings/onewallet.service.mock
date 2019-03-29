import { hash } from 'highoutput-utilities';
import R from 'ramda';

import { Rabbit } from './types';
import { generateId } from './util';

type Pagination<T> = {
  first?: number;
  after?: string;
  filter: T;
};

type Language = 'en' | 'zh' | 'zh-Hant' | 'zh-Hans';

type Type =
  | 'Message'
  | 'Messages'
  | 'AccountMessages'
  | 'CreateMessage'
  | 'MarkAsRead';

type DataInput = { readonly admin: string; readonly id: string } & Pagination<{
  readonly admin: string;
}> &
  Pagination<{ readonly account: string; readonly admin: string }> & {
    readonly admin: string;
    readonly creator?: string;
    readonly body: {
      [language in Language]?: { title: string; content: string }
    };
    readonly targetAccounts: string[];
    readonly targetMemberLevels?: string[];
  } & { readonly admin: string; readonly account: string; id: string };

type Message = {
  id: string;
  admin: string;
  creator?: string;
  body: any;
  targetAccounts: string[];
  targetMemberLevels?: string[];
  dateTimeCreated: Date;
};

let workers: any[];
let messages: Message[];

export async function start(
  rabbit: Rabbit,
  initialMessages: Message[]
): Promise<void> {
  messages = R.clone(initialMessages);

  workers = await Promise.all([
    rabbit.createWorker(
      'Message.Query',
      async ({ type, data }: { type: Type; data: DataInput }) => {
        if (type === 'Message') {
          return R.find(R.propEq('id', data.id))(messages);
        }

        if (type === 'Messages') {
          const filteredMessages = messages.filter(
            message => message.admin === data.filter.admin
          );

          const edges = filteredMessages.map(message => {
            const cursor = `${message.dateTimeCreated
              .getTime()
              .toString(36)
              .padStart(8, '0')}${hash(message.id)
              .toString('hex')
              .substr(0, 16)}}`;

            return {
              node: message,
              cursor: Buffer.from(cursor, 'utf8').toString('base64'),
            };
          });

          const endCursor =
            edges.length > 0
              ? R.prop('cursor')(R.last(edges) as { cursor: string })
              : null;

          let hasNextPage = false;

          return {
            totalCount: filteredMessages.length,
            edges,
            pageInfo: {
              endCursor,
              hasNextPage,
            },
          };
        }

        if (type === 'AccountMessages') {
          return 'Account Messages';
        }
      }
    ),

    rabbit.createWorker('Message.Command', async ({ type, data }) => {
      if (type === 'CreateMessage') {
        const id = generateId('msg');
        messages.push({
          ...data,
          dateTimeCreated: new Date(),
          id,
        });
        return id;
      }

      if (type === 'MarkAsRead') {
        return true;
      }
    }),
  ]);
}

export async function stop(): Promise<void> {
  await Promise.all(workers.map(worker => worker.stop()));
}
