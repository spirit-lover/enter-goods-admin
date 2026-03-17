import { SetMetadata } from '@nestjs/common';
import type { PermissionCode } from '@enterprise/shared';

export const Permission = (permission: PermissionCode) => SetMetadata('permission', permission);
