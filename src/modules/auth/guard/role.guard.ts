import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_METADATA } from './roles.metadata';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLE_METADATA,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    const userRoles = user?.roles?.map((role) => role?.name);

    return requiredRoles.some((role) => userRoles?.includes(role));
  }
}
