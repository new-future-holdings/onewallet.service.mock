"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const onewallet_library_error_1 = __importDefault(require("onewallet.library.error"));
class ResourceExistsError extends onewallet_library_error_1.default {
    constructor(meta) {
        super('RESOURCE_EXISTS', '', meta);
    }
}
exports.default = ResourceExistsError;
//# sourceMappingURL=resource-exists.js.map