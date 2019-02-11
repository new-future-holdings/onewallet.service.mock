"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
let workers;
let rebates;
exports.rebates = rebates;
async function start(rabbit, initialRebates) {
    exports.rebates = rebates = ramda_1.default.clone(initialRebates);
    workers = await Promise.all([
        rabbit.createWorker('Rebate.Query', async ({ type, data }) => {
            if (type === 'Rebate') {
                return (ramda_1.default.find(ramda_1.default.propEq('account', data.account))(rebates) || {
                    available: 0,
                    lockedBalance: 0,
                    turnoverRequirement: 0,
                });
            }
        }),
        rabbit.createWorker('Rebate.Command', async () => {
            return true;
        }),
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=rebate.js.map