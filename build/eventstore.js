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
    const event = Object.assign({}, data, { id: util_1.generateEventId(), timestamp: Date.now() });
    events.push(event);
    return event;
}
exports.addEvent = addEvent;
let publish;
exports.publish = publish;
let worker;
async function start(rabbit, initialEvents) {
    const publisher = await rabbit.createPublisher('OneWallet');
    exports.publish = publish = (event) => publisher(`${event.aggregateType}.${event.type}`, event);
    exports.events = events = ramda_1.default.clone(initialEvents);
    worker = await rabbit.createWorker('EventStore', async ({ type, data }) => {
        if (type === 'Events') {
            const conditions = [];
            if (data.aggregateType) {
                conditions.push(ramda_1.default.propEq('aggregateType', data.aggregateType));
            }
            if (data.aggregateTypes) {
                conditions.push((event) => ramda_1.default.contains(event.aggregateType)(data.aggregateTypes));
            }
            if (data.aggregateId) {
                conditions.push(ramda_1.default.propEq('aggregateId', data.aggregateId));
            }
            if (data.sinceId) {
                conditions.push(ramda_1.default.propSatisfies((value) => value > data.sinceId, 'id'));
            }
            if (!ramda_1.default.isNil(data.sinceAggregateVersion)) {
                conditions.push(ramda_1.default.propSatisfies((value) => value > data.sinceAggregateVersion, 'aggregateVersion'));
            }
            return ramda_1.default.compose(ramda_1.default.take(100), ramda_1.default.filter(ramda_1.default.allPass(conditions)))(events);
        }
        if (type === 'CreateEvent') {
            const event = addEvent(data);
            await publish(event);
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