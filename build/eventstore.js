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
exports.events = events;
function clearEvents(initialEvents) {
    exports.events = events = initialEvents || [];
}
exports.clearEvents = clearEvents;
function addEvent(data) {
    const event = Object.assign({}, data, { id: util_1.generateId('evn').slice(0, 27), timestamp: Date.now() });
    events.push(event);
    return event;
}
exports.addEvent = addEvent;
let worker;
async function start(rabbit, initialEvents) {
    const publish = await rabbit.createPublisher('OneWallet');
    exports.events = events = R.clone(initialEvents);
    worker = await rabbit.createWorker('EventStore', async ({ type, data }) => {
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
        if (type === 'Snapshot') {
            return null;
        }
    });
}
exports.start = start;
async function stop() {
    await worker.stop();
}
exports.stop = stop;
//# sourceMappingURL=eventstore.js.map