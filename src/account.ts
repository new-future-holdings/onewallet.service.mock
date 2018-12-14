import R from 'ramda';

import { Rabbit } from './types';
import { v4 as uuid } from 'uuid';
import ResourceNotFoundError from './errors/resource-not-found-error';
import InvalidRequestError from './errors/invalid-request-error';
import ResourceExistsError from './errors/resource-exists';

type ErrorsTypes = 'RoleSuperAdmin' | 'RoleMember'  | 'RoleOperatorWithRoleSuperAdmin' | 'RoleOperatorWithRoleAdmin' 
  | 'RoleOperatorWithRoleOperator' | 'AccountNotFound' | 'AdminNotMemberLevelOwner'
  | 'PermissionGrouptNotFound' | 'PermissionGroupWithPermissionGroup' | 'PermissionGroupWithPerMissionGroup' 
  | 'AdminNotPermissionGroupAdmin' | 'AdminNotPermissionGroupOwner' | 'AdminPermissionGroupExist'
  | 'MemberLevelNotFound' | 'MemberLevelExist' | 'AccountMemberLevelNotFound';
let workers: any[];
export async function start(rabbit: Rabbit, accounts: any[]) {
  workers = await Promise.all([
    rabbit.createWorker('Account.Query', async ({ type, data }) => {
      if (type === 'Information') {
        return R.find(R.propEq('id', data.id))(accounts) || null;
      }
    }),
    rabbit.createWorker('Account.Command',
     async function handleCommand ({ type, data }: { type: string, data: ErrorsTypes }) {
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
        if (data === 'RoleOperatorWithRoleOperator' ) {
          throw new InvalidRequestError(
            'Operator cannot create account with role `operator`.',
            { invalidRole: true }
          );
        }
        return true;
      }
      if (type === 'UpdateAccount') {
        if (data === 'AccountNotFound') {
          throw new ResourceNotFoundError({ type: 'user', id: uuid() });
        }
        return true;
      }
      if ( type === 'UpdatePermissionGroup') {
        if (data === 'PermissionGrouptNotFound') {
          throw new ResourceNotFoundError({ id: uuid() });
        }
        if (data === 'PermissionGroupWithPermissionGroup') {
          throw new ResourceNotFoundError({ id: uuid() });
        }
        return true;
      }
     if (type === 'DeletePermissionGroup') {
       if (data === 'PermissionGrouptNotFound') {
        throw new ResourceNotFoundError({ id: uuid() });
       }
       if (data === 'PermissionGroupWithPerMissionGroup') {
        throw new ResourceNotFoundError({ id: uuid() });
       }
       return true;
     }
     if (type === 'UpdateMemberLevel') {
        if (data === 'AdminNotMemberLevelOwner') {
          throw new ResourceNotFoundError({
            type: 'member_level',
            id: uuid(),
          });
        }
        return true;
     }
     if (type === 'DeleteMemberLevel') {
      if (data === 'AdminNotMemberLevelOwner') {
        throw new ResourceNotFoundError({
          type: 'member_level',
          id: uuid(),
        });
      }
      return true;
    }
    if (type === 'AssignPermissionGroup') {
      if (data === 'AccountNotFound') {
        throw new ResourceNotFoundError({ type: 'account', id: uuid() });
      }
      if (data === 'PermissionGrouptNotFound') {
        throw new ResourceNotFoundError({
          type: 'permission_group',
          id: uuid(),
        });
      }
      if (data === 'AdminNotPermissionGroupOwner') {
        throw new ResourceNotFoundError({
          account: uuid(),
          permissionGroup: uuid(),
          admin: uuid(),
          adminMismatch: true,
        });
      }
      if (data === 'AdminPermissionGroupExist') {
        throw new ResourceExistsError({
          account: uuid(),
          permissionGroup: uuid(),
        });
      }
      return true;
    }

    if (type === 'DeassignPermissionGroup') {
      if (data === 'AccountNotFound') {
        throw new ResourceNotFoundError({ type: 'account', id: uuid() });
      }
      if (data === 'PermissionGrouptNotFound') {
        throw new ResourceNotFoundError({
          type: 'permission_group',
          id: uuid(),
        });
      }
      if (data === 'AdminNotPermissionGroupOwner') {
        throw new ResourceNotFoundError({
          account: uuid(),
          permissionGroup: uuid(),
          admin: uuid(),
        });
      }
      return true;
    }
    if (type === 'AssignAccountMemberLevel') {
      if (data === 'MemberLevelNotFound') {
        throw new ResourceNotFoundError({
          type: 'member_level',
          id: uuid(),
        });
      }
      if (data === 'MemberLevelExist') {
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
      if (data === 'AccountMemberLevelNotFound') {
        throw new ResourceNotFoundError({
          type: 'account_member_level',
          id: uuid(),
          account: uuid(),
          memberLevel: uuid(),
        });
      } 
    }
    }),
  ]);
}
export async function stop() {
  await Promise.all(workers.map(worker => worker.stop()));
}