"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let workers;
async function start(rabbit) {
    workers = await Promise.all([
        rabbit.createWorker('Message.Query', async () => {
            return [];
        }),
        rabbit.createWorker('Message.Command', async () => {
            return true;
        }),
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=message.js.map