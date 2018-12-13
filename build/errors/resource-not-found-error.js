"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const onewallet_library_error_1 = __importDefault(require("onewallet.library.error"));
class ResourceNotFoundError extends onewallet_library_error_1.default {
    constructor(meta) {
        super('RESOURCE_NOT_FOUND', '', meta || {});
    }
}
exports.default = ResourceNotFoundError;
//# sourceMappingURL=resource-not-found-error.js.map