"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function startWorker(rabbit) {
    await rabbit.createWorker('Balance.Command', async () => true);
}
exports.startWorker = startWorker;
//# sourceMappingURL=balance.js.map