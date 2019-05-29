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
            if (type === 'Balance') {
                return (ramda_1.default.find(ramda_1.default.propEq('account', data.account))(balances) || {
                    account: data.account,
                    totalBalance: 0,
                    withdrawableBalance: 0,
                    totalTurnoverRequirement: 0,
                    currentTurnover: 0,
                });
            }
        }),
        rabbit.createWorker('Balance.Command', async ({ type, data }) => {
            const document = ramda_1.default.find(ramda_1.default.propEq('account', data.account))(balances);
            if (!document) {
                return false;
            }
            if (type === 'Credit') {
                const balance = +new big_js_1.default(document.totalBalance).add(data.amount);
                document.totalBalance = balance;
                document.withdrawableBalance = balance;
                return true;
            }
            if (type === 'Debit') {
                const balance = +new big_js_1.default(document.totalBalance).sub(data.amount);
                document.totalBalance = balance;
                document.withdrawableBalance = balance;
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