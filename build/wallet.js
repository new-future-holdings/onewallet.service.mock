"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
let workers;
let balances;
const debits = {};
function findDocument(account) {
    const document = ramda_1.default.find((item) => item.account === account)(balances);
    if (!document) {
        throw new Error(`Account with id \`${account}\` does not exist.`);
    }
    return document;
}
async function start(rabbit, initial) {
    balances = initial;
    workers = await Promise.all([
        rabbit.createWorker('Wallet.Query', async ({ type, data }) => {
            if (type === 'AvailableBalance' || type === 'TotalBalance') {
                return findDocument(data.account).balance;
            }
        }),
        rabbit.createWorker('Wallet.Command', async ({ type, data }) => {
            const document = findDocument(data.account);
            if (type === 'Credit') {
                document.balance += data.amount;
                return true;
            }
            if (type === 'Debit') {
                document.balance -= data.amount;
                debits[data.transaction] = data.amount;
                return true;
            }
            if (type === 'RollbackDebit') {
                document.balance += debits[data.transaction];
                delete debits[data.transaction];
                return true;
            }
            if (type === 'AddTurnover') {
                return true;
            }
            throw new Error(`\`${type}\` is not supported.`);
        }),
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=wallet.js.map