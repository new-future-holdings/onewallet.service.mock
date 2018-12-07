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
function clearEvents(initialEvents) {
    events = initialEvents || [];
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
    events = R.clone(initialEvents);
    worker = await rabbit.createWorker('EventStore', async ({ type, data }) => {
        if (type === 'Events') {
            const conditions = [];
            if (data.aggregateType) {
                conditions.push(R.propEq('aggregateType', data.aggregateType));
            }
            if (data.aggregateTypes) {
                conditions.push((event) => R.contains(event.aggregateType)(data.aggregateTypes));
            }
            if (data.aggregateId) {
                conditions.push(R.propEq('aggregateId', data.aggregateId));
            }
            const result = R.filter(R.allPass(conditions))(events);
            events = R.filter(R.complement(R.allPass(conditions)))(events);
            return result;
        }
        if (type === 'CreateEvent') {
            const event = Object.assign({}, data, { id: util_1.generateId('evn').slice(0, 27), timestamp: Date.now() });
            events.push(event);
            await publish(`${data.aggregateType}.${data.aggregateId}`, event);
            return event;
        }
    });
}
exports.start = start;
async function stop() {
    await worker.stop();
}
exports.stop = stop;
//# sourceMappingURL=eventstore.js.map