"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
function generateId(prefix = 'bal', uuid) {
    const id = uuid ? uuid : uuid_1.v4();
    return `${prefix}_${id.split('-').join('')}`;
}
exports.generateId = generateId;
//# sourceMappingURL=util.js.map