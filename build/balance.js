"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
const big_js_1 = __importDefault(require("big.js"));
let workers;
let balances;
exports.balances = balances;
async function start(rabbit, initialBalances) {
    exports.balances = balances = ramda_1.default.clone(initialBalances);
    workers = await Promise.all([
        rabbit.createWorker('Balance.Query', async ({ type, data }) => {
            if (type === 'AvailableBalance') {
                return ramda_1.default.find(ramda_1.default.propEq('account', data.account))(balances) || null;
            }
        }),
        rabbit.createWorker('Balance.Command', async ({ type, data }) => {
            if (type === 'UpdateBalance') {
                const document = ramda_1.default.find(ramda_1.default.propEq('account', data.account))(balances);
                if (!document) {
                    return false;
                }
                const balance = +new big_js_1.default(document.total).add(data.delta);
                document.available = balance;
                document.total = balance;
                return true;
            }
            return true;
        }),
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=balance.js.map