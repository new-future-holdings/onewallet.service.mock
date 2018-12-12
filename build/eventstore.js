"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
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
    exports.events = events = ramda_1.default.clone(initialEvents);
    worker = await rabbit.createWorker('EventStore', async ({ type, data }) => {
        if (type === 'Events') {
            return ramda_1.default.filter((event) => {
                if (data.aggregateId) {
                    return (event.aggregateType === data.aggregateType &&
                        event.aggregateId === data.aggregateId);
                }
                if (data.aggregateTypes) {
                    return ramda_1.default.contains(event.aggregateType)(data.aggregateTypes);
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