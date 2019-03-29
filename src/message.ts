import R from 'ramda';

import { Rabbit } from './types';

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
  targetMemberLevels: string[];
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
          return messages.filter(message => message.admin === data.admin);
        }

        if (type === 'AccountMessages') {
          return 'Account Messages';
        }
      }
    ),

    rabbit.createWorker('Message.Command', async ({ type, data }) => {
      if (type === 'CreateMessage') {
        const document = R.find(R.propEq('id', data.id))(messages);
        console.log(document);
        return document.id;
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
