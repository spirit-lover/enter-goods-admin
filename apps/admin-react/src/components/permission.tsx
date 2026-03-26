import type { PermissionCode } from '@enterprise/shared';
import type { ReactNode } from 'react';
import { usePermissionStore } from '../stores/store-provider';

interface PermissionProps {
  permission?: PermissionCode;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Permission({ permission, children, fallback = null }: PermissionProps) {
  const can = usePermissionStore((state) => state.can);
  return can(permission) ? <>{children}</> : <>{fallback}</>;
}
