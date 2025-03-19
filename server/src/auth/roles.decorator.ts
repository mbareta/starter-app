import { SetMetadata } from '@nestjs/common';

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}
export const ROLES_KEY: string = 'roles';
export const Roles = (...allowedRoles: Role[]) => {
  return SetMetadata(ROLES_KEY, allowedRoles);
};
