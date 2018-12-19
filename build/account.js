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
            if (type === 'AccountMemberLevels') {
                return new Promise(() => [{
                        id: uuid_1.v4(),
                        admin: uuid_1.v4(),
                        name: uuid_1.v4(),
                        description: uuid_1.v4(),
                        handlingFeeType: uuid_1.v4(),
                        handlingFee: uuid_1.v4(),
                        minimumSingleWithdrawalLimit: uuid_1.v4(),
                        maximumSingleWithdrawalLimit: uuid_1.v4(),
                        maximumDailyWithdrawalLimit: uuid_1.v4(),
                        tableName: uuid_1.v4(),
                        timestamps: false,
                        indexes: uuid_1.v4(),
                    }]);
            }
            if (type === 'Authenticate') {
                if (data.account === 'AccountNotFound') {
                    throw new resource_not_found_error_1.default({ username: uuid_1.v4() });
                }
                if (data.account === 'AccountInvalidCredentials') {
                    throw new invalid_request_error_1.default('Invalid credentials', {
                        invalidCredentials: true,
                    });
                }
                return new Promise(() => {
                    id: uuid_1.v4();
                    username: uuid_1.v4();
                    hash: uuid_1.v4();
                    firstname: uuid_1.v4();
                    lastname: uuid_1.v4();
                    nickname: uuid_1.v4();
                    gender: uuid_1.v4();
                    mobilePhone: uuid_1.v4();
                    email: uuid_1.v4();
                    wechat: uuid_1.v4();
                    qqnumber: uuid_1.v4();
                    displayName: uuid_1.v4();
                    currency: uuid_1.v4();
                    language: uuid_1.v4();
                    parent: uuid_1.v4();
                    adminCode: uuid_1.v4();
                    admin: uuid_1.v4();
                    role: uuid_1.v4();
                    lastLogin: uuid_1.v4();
                    enabled: true;
                    frozen: true;
                    site: uuid_1.v4();
                    timestamp: uuid_1.v4();
                });
            }
            if (type === 'Informations') {
                return new Promise(() => {
                    id: uuid_1.v4();
                    username: uuid_1.v4();
                    hash: uuid_1.v4();
                    firstname: uuid_1.v4();
                    lastname: uuid_1.v4();
                    nickname: uuid_1.v4();
                    gender: uuid_1.v4();
                    mobilePhone: uuid_1.v4();
                    email: uuid_1.v4();
                    wechat: uuid_1.v4();
                    qqnumber: uuid_1.v4();
                    displayName: uuid_1.v4();
                    currency: uuid_1.v4();
                    language: uuid_1.v4();
                    parent: uuid_1.v4();
                    adminCode: uuid_1.v4();
                    admin: uuid_1.v4();
                    role: uuid_1.v4();
                    lastLogin: uuid_1.v4();
                    enabled: true;
                    frozen: true;
                    site: uuid_1.v4();
                    timestamp: uuid_1.v4();
                });
            }
        }),
        rabbit.createWorker('Account.Command', async function handleCommand({ type, data }) {
            if (type === 'CreateAccount') {
                if (data.username === 'RoleSuperAdmin') {
                    throw new invalid_request_error_1.default('Cannot create account with role `super_admin`.', { invalidRole: true });
                }
                if (data.username === 'RoleMember') {
                    throw new invalid_request_error_1.default('Accounts with `member` role cannot create account', { invalidRole: true });
                }
                if (data.username === 'RoleOperatorWithRoleAdmin') {
                    throw new invalid_request_error_1.default('Operator cannot create account with role `admin`.', { invalidRole: true });
                }
                if (data.username === 'RoleOperatorWithRoleSuperAdmin') {
                    throw new invalid_request_error_1.default('Operator cannot create account with role `super_admin`.', { invalidRole: true });
                }
                if (data.username === 'RoleOperatorWithRoleOperator') {
                    throw new invalid_request_error_1.default('Operator cannot create account with role `operator`.', { invalidRole: true });
                }
                return true;
            }
            if (type === 'UpdateAccount') {
                if (data.username === 'AccountNotFound') {
                    throw new resource_not_found_error_1.default({ type: 'user', id: uuid_1.v4() });
                }
                return true;
            }
            if (type === 'AssignPermissionGroup') {
                if (data.account === 'AccountNotFound') {
                    throw new resource_not_found_error_1.default({ type: 'account', id: uuid_1.v4() });
                }
                if (data.account === 'PermissionGrouptNotFound') {
                    throw new resource_not_found_error_1.default({
                        type: 'permission_group',
                        id: uuid_1.v4(),
                    });
                }
                if (data.account === 'AdminNotPermissionGroupOwner') {
                    throw new resource_not_found_error_1.default({
                        account: uuid_1.v4(),
                        permissionGroup: uuid_1.v4(),
                        admin: uuid_1.v4(),
                        adminMismatch: true,
                    });
                }
                if (data.account === 'AdminPermissionGroupExist') {
                    throw new resource_exists_1.default({
                        account: uuid_1.v4(),
                        permissionGroup: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'DeassignPermissionGroup') {
                if (data.account === 'AccountNotFound') {
                    throw new resource_not_found_error_1.default({ type: 'account', id: uuid_1.v4() });
                }
                if (data.account === 'PermissionGrouptNotFound') {
                    throw new resource_not_found_error_1.default({
                        type: 'permission_group',
                        id: uuid_1.v4(),
                    });
                }
                if (data.account === 'AdminNotPermissionGroupOwner') {
                    throw new resource_not_found_error_1.default({
                        account: uuid_1.v4(),
                        permissionGroup: uuid_1.v4(),
                        admin: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'UpdatePermissionGroup') {
                if (data.admin === 'PermissionGrouptNotFound') {
                    throw new resource_not_found_error_1.default({ id: uuid_1.v4() });
                }
                if (data.admin === 'PermissionGroupWithPerMissionGroup') {
                    throw new resource_not_found_error_1.default({ id: uuid_1.v4() });
                }
                return true;
            }
            if (type === 'DeletePermissionGroup') {
                if (data.admin === 'PermissionGrouptNotFound') {
                    throw new resource_not_found_error_1.default({ id: uuid_1.v4() });
                }
                if (data.admin === 'PermissionGroupWithPerMissionGroup') {
                    throw new resource_not_found_error_1.default({ id: uuid_1.v4() });
                }
                return true;
            }
            if (type === 'AssignAccountMemberLevel') {
                if (data.account === 'MemberLevelNotFound') {
                    throw new resource_not_found_error_1.default({
                        type: 'member_level',
                        id: uuid_1.v4(),
                    });
                }
                if (data.account === 'MemberLevelExist') {
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
                if (data.account === 'AccountMemberLevelNotFound') {
                    throw new resource_not_found_error_1.default({
                        type: 'account_member_level',
                        id: uuid_1.v4(),
                        account: uuid_1.v4(),
                        memberLevel: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'UpdateMemberLevel') {
                if (data.id === 'AdminNotMemberLevelOwner') {
                    throw new resource_not_found_error_1.default({
                        type: 'member_level',
                        id: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'DeleteMemberLevel') {
                if (data.id === 'AdminNotMemberLevelOwner') {
                    throw new resource_not_found_error_1.default({
                        type: 'member_level',
                        id: uuid_1.v4(),
                    });
                }
                return true;
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