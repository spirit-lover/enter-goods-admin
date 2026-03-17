import { describe, expect, it } from 'vitest';
import { buildMenuTree, hasPermission, PERMISSION_CODES, type MenuTreeNode } from '../src';

describe('permission helpers', () => {
  it('将扁平菜单转换为树结构', () => {
    const nodes: MenuTreeNode[] = [
      { id: 'dashboard', parentId: null, name: 'dashboard', title: '仪表盘', path: '/dashboard', type: 'catalog' },
      { id: 'dashboard-home', parentId: 'dashboard', name: 'dashboard-home', title: '首页', path: '/dashboard/home', type: 'menu' }
    ];

    const tree = buildMenuTree(nodes);

    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children?.[0].name).toBe('dashboard-home');
  });

  it('在未声明权限时默认放行', () => {
    expect(hasPermission([PERMISSION_CODES.productRead])).toBe(true);
  });

  it('按权限码判断访问能力', () => {
    expect(hasPermission([PERMISSION_CODES.productRead], PERMISSION_CODES.productWrite)).toBe(false);
    expect(hasPermission([PERMISSION_CODES.productRead], PERMISSION_CODES.productRead)).toBe(true);
  });
});
