"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
let workers;
async function start(rabbit, accounts) {
    workers = await Promise.all([
        rabbit.createWorker('Account.Query', async ({ type, data }) => {
            if (type === 'Information') {
                return ramda_1.default.find(ramda_1.default.propEq('id', data.id))(accounts) || null;
            }
        }),
        rabbit.createWorker('Account.Command', async () => true),
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=account.js.map