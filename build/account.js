"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
const uuid_1 = require("uuid");
const resource_not_found_error_1 = __importDefault(require("./errors/resource-not-found-error"));
const invalid_request_error_1 = __importDefault(require("./errors/invalid-request-error"));
const resource_exists_1 = __importDefault(require("./errors/resource-exists"));
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
                if (data === 'RoleOperatorWithRoleOperator') {
                    throw new invalid_request_error_1.default('Operator cannot create account with role `operator`.', { invalidRole: true });
                }
                return true;
            }
            if (type === 'UpdateAccount') {
                if (data === 'AccountNotFound') {
                    throw new resource_not_found_error_1.default({ type: 'user', id: uuid_1.v4() });
                }
                return true;
            }
            if (type === 'UpdatePermissionGroup') {
                if (data === 'PermissionGrouptNotFound') {
                    throw new resource_not_found_error_1.default({ id: uuid_1.v4() });
                }
                if (data === 'PermissionGroupWithPermissionGroup') {
                    throw new resource_not_found_error_1.default({ id: uuid_1.v4() });
                }
                return true;
            }
            if (type === 'DeletePermissionGroup') {
                if (data === 'PermissionGrouptNotFound') {
                    throw new resource_not_found_error_1.default({ id: uuid_1.v4() });
                }
                if (data === 'PermissionGroupWithPerMissionGroup') {
                    throw new resource_not_found_error_1.default({ id: uuid_1.v4() });
                }
                return true;
            }
            if (type === 'UpdateMemberLevel') {
                if (data === 'AdminNotMemberLevelOwner') {
                    throw new resource_not_found_error_1.default({
                        type: 'member_level',
                        id: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'DeleteMemberLevel') {
                if (data === 'AdminNotMemberLevelOwner') {
                    throw new resource_not_found_error_1.default({
                        type: 'member_level',
                        id: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'AssignPermissionGroup') {
                if (data === 'AccountNotFound') {
                    throw new resource_not_found_error_1.default({ type: 'account', id: uuid_1.v4() });
                }
                if (data === 'PermissionGrouptNotFound') {
                    throw new resource_not_found_error_1.default({
                        type: 'permission_group',
                        id: uuid_1.v4(),
                    });
                }
                if (data === 'AdminNotPermissionGroupOwner') {
                    throw new resource_not_found_error_1.default({
                        account: uuid_1.v4(),
                        permissionGroup: uuid_1.v4(),
                        admin: uuid_1.v4(),
                        adminMismatch: true,
                    });
                }
                if (data === 'AdminPermissionGroupExist') {
                    throw new resource_exists_1.default({
                        account: uuid_1.v4(),
                        permissionGroup: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'DeassignPermissionGroup') {
                if (data === 'AccountNotFound') {
                    throw new resource_not_found_error_1.default({ type: 'account', id: uuid_1.v4() });
                }
                if (data === 'PermissionGrouptNotFound') {
                    throw new resource_not_found_error_1.default({
                        type: 'permission_group',
                        id: uuid_1.v4(),
                    });
                }
                if (data === 'AdminNotPermissionGroupOwner') {
                    throw new resource_not_found_error_1.default({
                        account: uuid_1.v4(),
                        permissionGroup: uuid_1.v4(),
                        admin: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'AssignAccountMemberLevel') {
                if (data === 'MemberLevelNotFound') {
                    throw new resource_not_found_error_1.default({
                        type: 'member_level',
                        id: uuid_1.v4(),
                    });
                }
                if (data === 'MemberLevelExist') {
                    throw new resource_exists_1.default({
                        type: 'account_member_level',
                        id: uuid_1.v4(),
                        account: uuid_1.v4(),
                        memberLevel: uuid_1.v4(),
                    });
                }
                return uuid_1.v4();
            }
            if (type === 'DeassignAccountMemberLevel') {
                if (data === 'AccountMemberLevelNotFound') {
                    throw new resource_not_found_error_1.default({
                        type: 'account_member_level',
                        id: uuid_1.v4(),
                        account: uuid_1.v4(),
                        memberLevel: uuid_1.v4(),
                    });
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