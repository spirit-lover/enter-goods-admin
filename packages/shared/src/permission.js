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
};
export function buildMenuTree(nodes) {
    const map = new Map();
    const roots = [];
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
export function hasPermission(permissions, permission) {
    if (!permission) {
        return true;
    }
    return permissions.includes(permission);
}
