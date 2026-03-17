export const PERMISSION_CODES = {
  dashboardView: 'dashboard:view',
  productRead: 'product:read',
  productWrite: 'product:write',
  productPublish: 'product:publish',
  inventoryAdjust: 'inventory:adjust',
  orderRead: 'order:read',
  systemUserManage: 'system:user:manage',
  systemRoleManage: 'system:role:manage',
  systemMenuManage: 'system:menu:manage',
  systemLogRead: 'system:log:read'
} as const;

export type PermissionCode = (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];

export interface MenuTreeNode {
  id: string;
  parentId: string | null;
  name: string;
  title: string;
  icon?: string;
  path: string;
  component?: string;
  permission?: PermissionCode;
  type: 'catalog' | 'menu' | 'button';
  hidden?: boolean;
  children?: MenuTreeNode[];
}

export function buildMenuTree(nodes: MenuTreeNode[]): MenuTreeNode[] {
  const map = new Map<string, MenuTreeNode>();
  const roots: MenuTreeNode[] = [];

  nodes.forEach((node) => {
    map.set(node.id, { ...node, children: [] });
  });

  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)?.children?.push(node);
      return;
    }
    roots.push(node);
  });

  return roots;
}

export function hasPermission(permissions: PermissionCode[], permission?: PermissionCode): boolean {
  if (!permission) {
    return true;
  }

  return permissions.includes(permission);
}
