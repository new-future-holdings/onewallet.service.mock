"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
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
                return messages.filter(message => message.admin === data.admin);
            }
            if (type === 'AccountMessages') {
                return 'Account Messages';
            }
        }),
        rabbit.createWorker('Message.Command', async ({ type, data }) => {
            if (type === 'CreateMessage') {
                console.log(data);
                const document = ramda_1.default.find(ramda_1.default.propEq('id', data.id))(messages);
                return document.id;
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