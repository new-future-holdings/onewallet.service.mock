import R from 'ramda';
import { Rabbit } from './types';
import { v4 as uuid } from 'uuid';
import ResourceNotFoundError from './errors/resource-not-found-error';
import InvalidRequestError from './errors/invalid-request-error';
import ResourceExistsError from './errors/resource-exists';


type Request = {
  withdrawal: 'WithdrawalIdNotFound' | 'WithdrawalNotOnPendingState'
} & {
  account: 'AccountExists' 
} & {
  memberLevel: 'MemberLevelNotExists' | 'PaymentMethodAndMemberLevelAlreadyExists'
} & {
  deposit: 'DepositNotExists' | 'DepositStatusNotFulfilled'
} & {
  id: 'PaymentMethodNotFound'
}
let workers: any[];
export async function start(rabbit: Rabbit, accounts: any[]){
  workers = await Promise.all([
    rabbit.createWorker('Account.Query', async ({type, data}) => {
      if (type === 'Information') {
        return R.find(R.propEq('id', data.id))(accounts) || null;
      }
    }),
    rabbit.createWorker('Account.Command',
    async function handleCommand({ type, data }: {type: string, data: Request }) {

      if(type === 'RejectWithdrawal') {
        if(data.withdrawal === 'WithdrawalIdNotFound') {
          throw new ResourceNotFoundError({
            type: 'withdrawal',
            id: uuid(),
          });
        }
        if(data.withdrawal === 'WithdrawalNotOnPendingState') {
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
        if (data.account === 'AccountExists') {
          throw new ResourceExistsError({
            id: uuid(),
            type: 'deposit',
          });
        }
        return true;
      }

      if (type === 'FulfillDeposit') {
        if (data.account === 'AccountExists') {
          throw new ResourceNotFoundError({
            id: uuid(),
            type: 'deposit',
          });
        }
        if(data.withdrawal === 'WithdrawalNotOnPendingState') {
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