"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const R = __importStar(require("ramda"));
const util_1 = require("./util");
let events = [];
function clearEvents() {
    events = [];
}
exports.clearEvents = clearEvents;
async function startWorker(rabbit) {
    const publish = await rabbit.createPublisher('OneWallet');
    await rabbit.createWorker('EventStore', async ({ type, data }) => {
        if (type === 'Events') {
            return R.filter((event) => {
                if (data.aggregateId) {
                    return (event.aggregateType === data.aggregateType &&
                        event.aggregateId === data.aggregateId);
                }
                return event.aggregateType === data.aggregateType;
            })(events);
        }
        if (type === 'CreateEvent') {
            const event = Object.assign({}, data, { id: util_1.generateId('evn').slice(0, 27), timestamp: Date.now() });
            events.push(event);
            await publish(`${data.aggregateType}.${data.aggregateId}`, event);
            return event;
        }
    });
}
exports.startWorker = startWorker;
//# sourceMappingURL=eventstore.js.map