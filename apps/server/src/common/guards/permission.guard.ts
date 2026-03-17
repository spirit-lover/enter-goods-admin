import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { PermissionCode } from '@enterprise/shared';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.getAllAndOverride<PermissionCode | undefined>('permission', [context.getHandler(), context.getClass()]);
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: { permissions?: PermissionCode[] } }>();
    const permissions = request.user?.permissions ?? [];

    if (!permissions.includes(permission)) {
      throw new ForbiddenException('无权执行当前操作');
    }

    return true;
  }
}
