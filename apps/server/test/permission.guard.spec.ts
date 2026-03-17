import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';
import { PermissionGuard } from '../src/common/guards/permission.guard';
import { PERMISSION_CODES } from '@enterprise/shared';

describe('PermissionGuard', () => {
  it('当用户缺少权限码时拒绝访问', () => {
    const reflector = new Reflector();
    const guard = new PermissionGuard(reflector);
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(PERMISSION_CODES.productWrite);

    const context = {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { permissions: [PERMISSION_CODES.productRead] } })
      })
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow('无权执行当前操作');
  });

  it('当用户拥有权限码时允许访问', () => {
    const reflector = new Reflector();
    const guard = new PermissionGuard(reflector);
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(PERMISSION_CODES.productWrite);

    const context = {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { permissions: [PERMISSION_CODES.productWrite] } })
      })
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });
});
