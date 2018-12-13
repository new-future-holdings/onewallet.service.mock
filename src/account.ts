import R from 'ramda';

import { Rabbit } from './types';
 
type Errors = 'RoleSuperAdmin' | 'RoleMember' | 'RoleOperatorWithRoleAdmin' 
  | 'RoleOperatorWithRoleSuperAdmin';

import InvalidRequestError from './errors/invalid-request-error';
let workers: any[];
export async function start(rabbit: Rabbit, accounts: any[]) {
  workers = await Promise.all([
    rabbit.createWorker('Account.Query', async ({ type, data }) => {
      if (type === 'Information') {
        return R.find(R.propEq('id', data.id))(accounts) || null;
      }
    }),
    rabbit.createWorker('Account.Command',
     async function handleCommand ({ type, data }: { type: string, data: Errors }) {
      if (type === 'CreateAccount') {
        if (data === 'RoleSuperAdmin') {
          throw new InvalidRequestError(
            'Cannot create account with role `super_admin`.',
            { invalidRole: true }
          );
        }
        if (data === 'RoleMember') {
          throw new InvalidRequestError(
            'Accounts with `member` role cannot create account',
            { invalidRole: true }
          );
        }
        if (data === 'RoleOperatorWithRoleAdmin' ) {
          throw new InvalidRequestError(
            'Operator cannot create account with role `admin`.',
            { invalidRole: true }
          );
        }
        if (data === 'RoleOperatorWithRoleSuperAdmin' ) {
          throw new InvalidRequestError(
            'Operator cannot create account with role `super_admin`.',
            { invalidRole: true }
          );
        }
        if (data === 'RoleOperatorWithRoleAdmin' ) {
          throw new InvalidRequestError(
            'Operator cannot create account with role `admin`.',
            { invalidRole: true }
          );
        }
        if (data === 'RoleOperatorWithRoleOperator' ) {
          throw new InvalidRequestError(
            'Operator cannot create account with role `operator`.',
            { invalidRole: true }
          );
        }
      }
    }),
  ]);
}
export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}