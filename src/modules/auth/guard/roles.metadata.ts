import { SetMetadata } from '@nestjs/common';

export const ROLE_METADATA = 'roles';
export const RolePermission = (...roles: string[]) =>
  SetMetadata(ROLE_METADATA, roles);
