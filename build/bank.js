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
            if (type === 'RejectWithdrawal') {
                if (data.withdrawal === 'WithdrawalIdNotFound') {
                    throw new resource_not_found_error_1.default({
                        type: 'withdrawal',
                        id: uuid_1.v4(),
                    });
                }
                if (data.withdrawal === 'WithdrawalNotOnPendingState') {
                    throw new invalid_request_error_1.default('Withdrawal is not on `pending` state', {
                        type: 'withdrawal',
                        id: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'ApproveWithdrawal') {
                if (data.withdrawal === 'WithdrawalIdNotFound') {
                    throw new resource_not_found_error_1.default({
                        type: 'withdrawal',
                        id: uuid_1.v4(),
                    });
                }
                if (data.withdrawal === 'WithdrawalNotOnPendingState') {
                    throw new invalid_request_error_1.default('Withdrawal is not on `pending` state', {
                        type: 'withdrawal',
                        id: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'CreateDeposit') {
                if (data.account === 'AccountExists') {
                    throw new resource_exists_1.default({
                        id: uuid_1.v4(),
                        type: 'deposit',
                    });
                }
                return true;
            }
            if (type === 'FulfillDeposit') {
                if (data.account === 'AccountExists') {
                    throw new resource_not_found_error_1.default({
                        id: uuid_1.v4(),
                        type: 'deposit',
                    });
                }
                if (data.withdrawal === 'WithdrawalNotOnPendingState') {
                    throw new invalid_request_error_1.default('', {
                        closed: true,
                    });
                }
                return true;
            }
            if (type === 'DeassignPaymentMethodMemberLevel') {
                if (data.memberLevel === 'MemberLevelNotExists') {
                    throw new resource_not_found_error_1.default({
                        type: 'payment_method_member_level',
                        id: uuid_1.v4(),
                        paymentMethod: uuid_1.v4(),
                        memberLevel: uuid_1.v4(),
                    });
                }
                return true;
            }
            if (type === 'AssignPaymentMethodMemberLevel') {
                if (data.memberLevel === 'MemberLevelNotExists') {
                    throw new resource_not_found_error_1.default({
                        type: 'member_level',
                        id: uuid_1.v4(),
                    });
                }
                if (data.memberLevel === 'PaymentMethodAndMemberLevelAlreadyExists') {
                    throw new resource_exists_1.default({
                        type: 'payment_method_member_level',
                        id: uuid_1.v4(),
                        paymentMethod: uuid_1.v4(),
                        memberLevel: uuid_1.v4(),
                    });
                }
                return uuid_1.v4();
            }
            if (type === 'RejectDeposit') {
                if (data.deposit === 'DepositNotExists') {
                    throw new resource_not_found_error_1.default({
                        id: uuid_1.v4(),
                        type: 'deposit',
                    });
                }
                if (data.deposit === 'DepositStatusNotFulfilled') {
                    throw new invalid_request_error_1.default('', {
                        closed: true,
                    });
                }
                return true;
            }
            if (type === 'ApproveDeposit') {
                if (data.deposit === 'DepositNotExists') {
                    throw new resource_not_found_error_1.default({
                        id: uuid_1.v4(),
                        type: 'deposit',
                    });
                }
                if (data.deposit === 'DepositStatusNotFulfilled') {
                    throw new invalid_request_error_1.default('', {
                        closed: true,
                    });
                }
                return true;
            }
            if (type === 'UpdatePaymentMethod') {
                if (data.id === 'PaymentMethodNotFound') {
                    throw new resource_not_found_error_1.default({ type: 'payment-method', id: uuid_1.v4() });
                }
                return true;
            }
            if (type === 'DeletePaymentMethod') {
                if (data.id === 'PaymentMethodNotFound') {
                    throw new resource_not_found_error_1.default({ type: 'deposit', id: uuid_1.v4() });
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
//# sourceMappingURL=bank.js.map