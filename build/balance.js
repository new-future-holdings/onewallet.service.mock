"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
let workers;
async function start(rabbit, balances) {
    workers = await Promise.all([
        rabbit.createWorker('Balance.Query', async ({ type, data }) => {
            if (type === 'AvailableBalance') {
                return ramda_1.default.find(ramda_1.default.propEq('account', data.account))(balances) || null;
            }
        }),
        rabbit.createWorker('Balance.Command', async () => true),
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=balance.js.map