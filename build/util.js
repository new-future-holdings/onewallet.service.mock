"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const ramda_1 = require("ramda");
function generateId(prefix = 'bal', uuid) {
    const id = uuid ? uuid : uuid_1.v4();
    return `${prefix}_${id.split('-').join('')}`;
}
exports.generateId = generateId;
function generateEventId() {
    const [, low, mid, high] = uuid_1.v1().match(/^([0-9a-f]{8})-([0-9a-f]{4})-1([0-9a-f]{3})/);
    return `evt_${high}${mid}${low}${crypto_1.default.randomBytes(4).toString('hex')}`;
}
exports.generateEventId = generateEventId;
function generateFakeEvent(params) {
    return ramda_1.mergeDeepLeft(params, {
        id: generateEventId(),
        timestamp: Date.now(),
        aggregateId: generateId('agg'),
        aggregateType: 1000,
        aggregateVersion: 0,
        body: {},
    });
}
exports.generateFakeEvent = generateFakeEvent;
//# sourceMappingURL=util.js.map