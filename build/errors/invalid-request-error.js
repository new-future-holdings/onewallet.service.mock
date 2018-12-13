"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const onewallet_library_error_1 = __importDefault(require("onewallet.library.error"));
class InvalidRequestError extends onewallet_library_error_1.default {
    constructor(message, meta) {
        super('INVALID_REQUEST', message, meta);
    }
}
exports.default = InvalidRequestError;
//# sourceMappingURL=invalid-request-error.js.map