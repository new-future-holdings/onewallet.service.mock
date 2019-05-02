"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let workers;
async function start(rabbit) {
    workers = await Promise.all([
        rabbit.createWorker('Sigma', async () => { }),
        rabbit.createWorker('Sigma.Query', async () => {
            return [];
        }),
        rabbit.createWorker('Sigma.Command', async () => {
            return true;
        }),
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=sigma.js.map