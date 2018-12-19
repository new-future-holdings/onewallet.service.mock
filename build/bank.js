"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const resource_not_found_error_1 = __importDefault(require("./errors/resource-not-found-error"));
const invalid_request_error_1 = __importDefault(require("./errors/invalid-request-error"));
const resource_exists_1 = __importDefault(require("./errors/resource-exists"));
let workers;
async function start(rabbit) {
    workers = await Promise.all([
        rabbit.createWorker('Account.Query', async function handleCommand({ type, data }) {
            if (type === 'CanWithdraw') {
                if (data.account === 'AccountMemberLevelNotExists') {
                    throw new invalid_request_error_1.default('No member level being assigned to the account', {
                        noMemberLevel: true,
                    });
                }
                if (data.account === 'HighPointMemberlLevelNotExists') {
                    throw new invalid_request_error_1.default('No member level being assigned to the account', {
                        noMemberLevel: true,
                    });
                }
                if (data.account === 'AmountIsGreaterThanCurrentAmount') {
                    throw new invalid_request_error_1.default('Withdrawal amount is not in range.', {
                        amount: 123.2,
                        minimumWithdrawal: 120.2,
                        maximumWithdrawal: 123.3,
                    });
                }
                if (data.account === 'DailyWithdrawalExceed') {
                    throw new invalid_request_error_1.default('Maximum daily withdrawal exceed', {
                        withdrawals: 200.2,
                        maximum: 300.5,
                    });
                }
                return new Promise(() => {
                    id: uuid_1.v4;
                    admin: uuid_1.v4();
                    name: uuid_1.v4();
                    description: uuid_1.v4();
                    handlingFeeType: 'PERCENTAGE';
                    handlingFee: 123;
                    minimumSingleWithdrawalLimit: 123;
                    maximumSingleWithdrawalLimit: 123;
                    maximumDailyWithdrawalLimit: 123;
                });
            }
            if (type === 'DepositTransactions') {
                return new Promise(() => {
                    id: uuid_1.v4();
                    transaction: uuid_1.v4();
                    account: uuid_1.v4();
                    admin: uuid_1.v4();
                    bankName: uuid_1.v4();
                    accountName: uuid_1.v4();
                    accountNumber: uuid_1.v4();
                    amount: uuid_1.v4();
                    reference: uuid_1.v4();
                    status: uuid_1.v4();
                    timestamp: uuid_1.v4();
                });
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
                if (data.account === 'AccountNotExists') {
                    throw new resource_exists_1.default({
                        id: uuid_1.v4(),
                        type: 'deposit',
                    });
                }
                return true;
            }
            if (type === 'FulfillDeposit') {
                if (data.account === 'AccountNotExists') {
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