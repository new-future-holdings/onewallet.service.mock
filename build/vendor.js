"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
let workers;
async function start(rabbit, games) {
    workers = await Promise.all([
        rabbit.createWorker('Vendor.Query', async ({ type, data }) => {
            if (type === 'Game') {
                return (ramda_1.default.find(game => game.vendor === data.vendor && game.gameCode === data.gameCode)(games) || null);
            }
        }),
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=vendor.js.map