import { Rabbit } from './types';
import { v4 as uuid } from 'uuid';
import ResourceNotFoundError from './errors/resource-not-found-error';
import InvalidRequestError from './errors/invalid-request-error';
import ResourceExistsError from './errors/resource-exists';

type Request = {
  withdrawal: 'WithdrawalIdNotFound' | 'WithdrawalNotOnPendingState'
} & {
  account: 'AccountNotExists' | 'AccountMemberLevelNotExists' | "HighPointMemberlLevelNotExists" | 'AmountIsGreaterThanCurrentAmount'
    | 'DailyWithdrawalExceed'
} & {
  memberLevel: 'MemberLevelNotExists' | 'PaymentMethodAndMemberLevelAlreadyExists'
} & {
  deposit: 'DepositNotExists' | 'DepositStatusNotFulfilled'
} & {
  id: 'PaymentMethodNotFound'
};
let workers: any[];
export async function start(rabbit: Rabbit) {
  workers = await Promise.all([
    rabbit.createWorker('Account.Query',
     async function handleCommand({type, data}: {type: string, data: Request}) {
      if (type === 'can-withdraw') {
        if (data.account === 'AccountMemberLevelNotExists') {
          throw new InvalidRequestError(
            'No member level being assigned to the account',
            {
              noMemberLevel: true,
            }
          );
        }
        if (data.account === 'HighPointMemberlLevelNotExists') {
          throw new InvalidRequestError(
            'No member level being assigned to the account',
            {
              noMemberLevel: true,
            }
          );
        }

        if (data.account === 'AmountIsGreaterThanCurrentAmount') {
          throw new InvalidRequestError('Withdrawal amount is not in range.', {
            amount: 123.2,
            minimumWithdrawal: 120.2,
            maximumWithdrawal: 123.3,
          });
        }

        if (data.account === 'DailyWithdrawalExceed') {
          throw new InvalidRequestError('Maximum daily withdrawal exceed', {
            withdrawals: 200.2,
            maximum:300.5,
          });
        }
        return new Promise(() => {
          id: uuid;
          admin: uuid();
          name: uuid();
          description: uuid();
          handlingFeeType: 'PERCENTAGE';
          handlingFee: 123;
          minimumSingleWithdrawalLimit: 123;
          maximumSingleWithdrawalLimit: 123;
          maximumDailyWithdrawalLimit: 123;
        });
      }
    }),
    rabbit.createWorker('Account.Command',
    async function handleCommand({ type, data }: {type: string, data: Request }) {

      if (type === 'RejectWithdrawal') {
        if (data.withdrawal === 'WithdrawalIdNotFound') {
          throw new ResourceNotFoundError({
            type: 'withdrawal',
            id: uuid(),
          });
        }
        if (data.withdrawal === 'WithdrawalNotOnPendingState') {
          throw new InvalidRequestError('Withdrawal is not on `pending` state', {
            type: 'withdrawal',
            id: uuid(),
          });
        }
        return true;
      }

      if (type === 'ApproveWithdrawal') {
        if (data.withdrawal === 'WithdrawalIdNotFound') {
          throw new ResourceNotFoundError({
            type: 'withdrawal',
            id: uuid(),
          });
        }
        if (data.withdrawal === 'WithdrawalNotOnPendingState') {
          throw new InvalidRequestError('Withdrawal is not on `pending` state', {
            type: 'withdrawal',
            id: uuid(),
          });
        }
        return true;
      }

      if (type === 'CreateDeposit') {
        if (data.account === 'AccountNotExists') {
          throw new ResourceExistsError({
            id: uuid(),
            type: 'deposit',
          });
        }
        return true;
      }

      if (type === 'FulfillDeposit') {
        if (data.account === 'AccountNotExists') {
          throw new ResourceNotFoundError({
            id: uuid(),
            type: 'deposit',
          });
        }
        if (data.withdrawal === 'WithdrawalNotOnPendingState') {
          throw new InvalidRequestError('', {
            closed: true,
          });
        }
        return true;
      }

      if (type === 'DeassignPaymentMethodMemberLevel') {
        if (data.memberLevel === 'MemberLevelNotExists') {
          throw new ResourceNotFoundError({
            type: 'payment_method_member_level',
            id: uuid(),
            paymentMethod: uuid(),
            memberLevel: uuid(),
          });
        }
        return true;
      }
      
      if (type === 'AssignPaymentMethodMemberLevel') {
        if (data.memberLevel === 'MemberLevelNotExists') {
          throw new ResourceNotFoundError({
            type: 'member_level',
            id: uuid(),
          });
        }
        if (data.memberLevel === 'PaymentMethodAndMemberLevelAlreadyExists') {
          throw new ResourceExistsError({
            type: 'payment_method_member_level',
            id: uuid(),
            paymentMethod: uuid(),
            memberLevel: uuid(),
          });
        }
        return uuid();
      }

      if (type === 'RejectDeposit') {
        if (data.deposit === 'DepositNotExists') {
          throw new ResourceNotFoundError({
            id: uuid(),
            type: 'deposit',
          });
        }
        if (data.deposit === 'DepositStatusNotFulfilled') {
          throw new InvalidRequestError('', {
            closed: true,
          });
        }
        return true;
      }

      if (type === 'ApproveDeposit') {
        if (data.deposit === 'DepositNotExists') {
          throw new ResourceNotFoundError({
            id: uuid(),
            type: 'deposit',
          });
        }
        if (data.deposit === 'DepositStatusNotFulfilled') {
          throw new InvalidRequestError('', {
            closed: true,
          });
        }
        return true;
      }

      if (type === 'UpdatePaymentMethod') {
        if (data.id === 'PaymentMethodNotFound') {
          throw new ResourceNotFoundError({ type: 'payment-method', id: uuid() });
        }
        return true;
      }

      if (type === 'DeletePaymentMethod') {
        if (data.id === 'PaymentMethodNotFound') {
          throw new ResourceNotFoundError({ type: 'deposit', id: uuid() });
        }
        return true;
      }
    }
    ),
  ]);
}
export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}