"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const highoutput_utilities_1 = require("highoutput-utilities");
const ramda_1 = __importDefault(require("ramda"));
const util_1 = require("./util");
let workers;
let messages;
async function start(rabbit, initialMessages) {
    messages = ramda_1.default.clone(initialMessages);
    workers = await Promise.all([
        rabbit.createWorker('Message.Query', async ({ type, data }) => {
            if (type === 'Message') {
                return ramda_1.default.find(ramda_1.default.propEq('id', data.id))(messages);
            }
            if (type === 'Messages') {
                const filteredMessages = messages.filter(message => message.admin === data.admin);
                const edges = filteredMessages.map(message => {
                    const cursor = `${message.dateTimeCreated
                        .getTime()
                        .toString(36)
                        .padStart(8, '0')}${highoutput_utilities_1.hash(message.id)
                        .toString('hex')
                        .substr(0, 16)}}`;
                    return {
                        node: message,
                        cursor: Buffer.from(cursor, 'utf8').toString('base64'),
                    };
                });
                return {
                    totalCount: filteredMessages.length,
                    edges,
                    pageInfo: {
                        endCursor: 'test',
                        hasNextPage: 'test',
                    },
                };
            }
            if (type === 'AccountMessages') {
                return 'Account Messages';
            }
        }),
        rabbit.createWorker('Message.Command', async ({ type, data }) => {
            if (type === 'CreateMessage') {
                const id = util_1.generateId('msg');
                messages.push(Object.assign({}, data, { dateTimeCreated: new Date(), id }));
                return id;
            }
            if (type === 'MarkAsRead') {
                return true;
            }
        }),
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=message.js.map