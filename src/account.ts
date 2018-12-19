import R from 'ramda';

import { Rabbit } from './types';
import { v4 as uuid } from 'uuid';
import ResourceNotFoundError from './errors/resource-not-found-error';
import InvalidRequestError from './errors/invalid-request-error';
import ResourceExistsError from './errors/resource-exists';

type Request = {
  username: 'RoleSuperAdmin' | 'RoleMember'  | 'RoleOperatorWithRoleSuperAdmin' | 'RoleOperatorWithRoleAdmin' 
  | 'RoleOperatorWithRoleOperator' | 'AccountNotFound' 
} & {
  admin: 'PermissionGroupWithPerMissionGroup' | 'PermissionGrouptNotFound'
} & {
  account: 'AdminNotPermissionGroupAdmin' | 'AdminNotPermissionGroupOwner' | 'AdminPermissionGroupExist' 
  | 'MemberLevelNotFound' | 'MemberLevelExist' | 'AccountMemberLevelNotFound' 
  | 'AccountNotFound' | 'PermissionGrouptNotFound' | 'AccountInvalidCredentials'
} & {
  id: | 'AdminNotMemberLevelOwner'
};

let workers: any[];
export async function start(rabbit: Rabbit, accounts: any[]) {
  workers = await Promise.all([
    rabbit.createWorker('Account.Query', async ({ type, data }) => {
      if (type === 'Information') {
        return R.find(R.propEq('id', data.id))(accounts) || null;
      }
      if (type === 'AccountMemberLevels') {
        return new Promise(() => [{
          id: uuid(),
          admin: uuid(),
          name: uuid(),
          description: uuid(),
          handlingFeeType: uuid(),
          handlingFee: uuid(),
          minimumSingleWithdrawalLimit: uuid(),
          maximumSingleWithdrawalLimit: uuid(),
          maximumDailyWithdrawalLimit: uuid(),
          tableName: uuid(),
          timestamps: false,
          indexes: uuid(),
        }]);
      }

      if (type === 'Authenticate') {
        if (data.account === 'AccountNotFound') {
          throw new ResourceNotFoundError({ username: uuid() });
        }
        if (data.account === 'AccountInvalidCredentials') {
          throw new InvalidRequestError('Invalid credentials', {
            invalidCredentials: true,
          });
        }
        return new Promise(() => {
          id: uuid();
          username: uuid();
          hash: uuid();
          firstname: uuid();
          lastname: uuid();
          nickname: uuid();
          gender: uuid();
          mobilePhone: uuid();
          email: uuid();
          wechat: uuid();
          qqnumber: uuid();
          displayName: uuid();
          currency: uuid();
          language: uuid();
          parent: uuid();
          adminCode: uuid();
          admin: uuid();
          role: uuid();
          lastLogin: uuid();
          enabled: true;
          frozen: true;
          site: uuid();
          timestamp: uuid();
        });
      }
    }),
    rabbit.createWorker('Account.Command',
     async function handleCommand ({ type, data }: { type: string, data: Request }) {
      if (type === 'CreateAccount') {
        if (data.username === 'RoleSuperAdmin') {
          throw new InvalidRequestError(
            'Cannot create account with role `super_admin`.',
            { invalidRole: true }
          );
        }
        if (data.username === 'RoleMember') {
          throw new InvalidRequestError(
            'Accounts with `member` role cannot create account',
            { invalidRole: true }
          );
        }
        if (data.username === 'RoleOperatorWithRoleAdmin' ) {
          throw new InvalidRequestError(
            'Operator cannot create account with role `admin`.',
            { invalidRole: true }
          );
        }
        if (data.username === 'RoleOperatorWithRoleSuperAdmin' ) {
          throw new InvalidRequestError(
            'Operator cannot create account with role `super_admin`.',
            { invalidRole: true }
          );
        }
        if (data.username === 'RoleOperatorWithRoleOperator' ) {
          throw new InvalidRequestError(
            'Operator cannot create account with role `operator`.',
            { invalidRole: true }
          );
        }
        return true;
      }
      if (type === 'UpdateAccount') {
        if (data.username === 'AccountNotFound') {
          throw new ResourceNotFoundError({ type: 'user', id: uuid() });
        }
        return true;
      }
      if (type === 'AssignPermissionGroup') {
        if (data.account === 'AccountNotFound') {
          throw new ResourceNotFoundError({ type: 'account', id: uuid() });
        }
        if (data.account === 'PermissionGrouptNotFound') {
          throw new ResourceNotFoundError({
            type: 'permission_group',
            id: uuid(),
          });
        }
        if (data.account === 'AdminNotPermissionGroupOwner') {
          throw new ResourceNotFoundError({
            account: uuid(),
            permissionGroup: uuid(),
            admin: uuid(),
            adminMismatch: true,
          });
        }
        if (data.account === 'AdminPermissionGroupExist') {
          throw new ResourceExistsError({
            account: uuid(),
            permissionGroup: uuid(),
          });
        }
        return true;
      }
      if (type === 'DeassignPermissionGroup') {
        if (data.account === 'AccountNotFound') {
          throw new ResourceNotFoundError({ type: 'account', id: uuid() });
        }
        if (data.account === 'PermissionGrouptNotFound') {
          throw new ResourceNotFoundError({
            type: 'permission_group',
            id: uuid(),
          });
        }
        if (data.account === 'AdminNotPermissionGroupOwner') {
          throw new ResourceNotFoundError({
            account: uuid(),
            permissionGroup: uuid(),
            admin: uuid(),
          });
        }
        return true;
      }
      if ( type === 'UpdatePermissionGroup') {
        if (data.admin === 'PermissionGrouptNotFound') {
          throw new ResourceNotFoundError({ id: uuid() });
        }
        if (data.admin === 'PermissionGroupWithPerMissionGroup') {
          throw new ResourceNotFoundError({ id: uuid() });
        }
        return true;
      }
      if (type === 'DeletePermissionGroup') {
        if (data.admin === 'PermissionGrouptNotFound') {
          throw new ResourceNotFoundError({ id: uuid() });
        }
        if (data.admin === 'PermissionGroupWithPerMissionGroup') {
          throw new ResourceNotFoundError({ id: uuid() });
        }
        return true;
      }
      if (type === 'AssignAccountMemberLevel') {
        if (data.account === 'MemberLevelNotFound') {
          throw new ResourceNotFoundError({
            type: 'member_level',
            id: uuid(),
          });
        }
        if (data.account === 'MemberLevelExist') {
          throw new ResourceExistsError({
            type: 'account_member_level',
            id: uuid(),
            account: uuid(),
            memberLevel: uuid(),
          });
        }
        return uuid();
      }
      if (type === 'DeassignAccountMemberLevel') {
        if (data.account === 'AccountMemberLevelNotFound') {
          throw new ResourceNotFoundError({
            type: 'account_member_level',
            id: uuid(),
            account: uuid(),
            memberLevel: uuid(),
          });
        } 
        return true;
      }
      if (type === 'UpdateMemberLevel') {
        if (data.id === 'AdminNotMemberLevelOwner') {
          throw new ResourceNotFoundError({
            type: 'member_level',
            id: uuid(),
          });
        }
        return true;
      }
      if (type === 'DeleteMemberLevel') {
       if (data.id === 'AdminNotMemberLevelOwner') {
         throw new ResourceNotFoundError({
           type: 'member_level',
           id: uuid(),
        });
      }
      return true;
      }
    }),
  ]);
}
export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}