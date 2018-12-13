"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
const invalid_request_error_1 = __importDefault(require("./errors/invalid-request-error"));
let workers;
async function start(rabbit, accounts) {
    workers = await Promise.all([
        rabbit.createWorker('Account.Query', async ({ type, data }) => {
            if (type === 'Information') {
                return ramda_1.default.find(ramda_1.default.propEq('id', data.id))(accounts) || null;
            }
        }),
        rabbit.createWorker('Account.Command', async function handleCommand({ type, data }) {
            if (type === 'CreateAccount') {
                if (data === 'RoleSuperAdmin') {
                    throw new invalid_request_error_1.default('Cannot create account with role `super_admin`.', { invalidRole: true });
                }
                if (data === 'RoleMember') {
                    throw new invalid_request_error_1.default('Accounts with `member` role cannot create account', { invalidRole: true });
                }
                if (data === 'RoleOperatorWithRoleAdmin') {
                    throw new invalid_request_error_1.default('Operator cannot create account with role `admin`.', { invalidRole: true });
                }
                if (data === 'RoleOperatorWithRoleSuperAdmin') {
                    throw new invalid_request_error_1.default('Operator cannot create account with role `super_admin`.', { invalidRole: true });
                }
                if (data === 'RoleOperatorWithRoleAdmin') {
                    throw new invalid_request_error_1.default('Operator cannot create account with role `admin`.', { invalidRole: true });
                }
                if (data === 'RoleOperatorWithRoleOperator') {
                    throw new invalid_request_error_1.default('Operator cannot create account with role `operator`.', { invalidRole: true });
                }
            }
        }),
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=account.js.map