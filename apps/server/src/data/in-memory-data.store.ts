import { Injectable } from '@nestjs/common';
import { buildMenuTree, PERMISSION_CODES, type CategoryDTO, type InventoryAdjustPayload, type InventoryRecordDTO, type MenuTreeNode, type OrderDTO, type PageResult, type ProductDTO, type ProductFilter, type ProductUpsertPayload, type UserProfile } from '@enterprise/shared';
import { hashSync } from 'bcryptjs';
import type { DataStore, OperationLogRecord, RoleRecord, SessionRecord, UserRecord } from './contracts/data-store';

@Injectable()
export class InMemoryDataStore implements DataStore {
  readonly roles: RoleRecord[] = [
    {
      id: 'role-admin',
      name: '系统管理员',
      permissionCodes: Object.values(PERMISSION_CODES),
      menuIds: ['dashboard', 'goods', 'goods-list', 'goods-category', 'goods-inventory', 'order', 'order-list', 'system', 'system-user', 'system-role', 'system-menu', 'system-log']
    },
    {
      id: 'role-operator',
      name: '运营专员',
      permissionCodes: [PERMISSION_CODES.dashboardView, PERMISSION_CODES.productRead, PERMISSION_CODES.productPublish, PERMISSION_CODES.orderRead],
      menuIds: ['dashboard', 'goods', 'goods-list', 'order', 'order-list']
    }
  ];

  readonly menus: MenuTreeNode[] = buildMenuTree([
    { id: 'dashboard', parentId: null, name: 'dashboard', title: '仪表盘', path: '/dashboard', component: 'dashboard/index', type: 'catalog', icon: 'House' },
    { id: 'goods', parentId: null, name: 'goods', title: '商品中心', path: '/goods', type: 'catalog', icon: 'Goods' },
    { id: 'goods-list', parentId: 'goods', name: 'goods-list', title: '商品管理', path: '/goods/products', component: 'product/list', type: 'menu', permission: PERMISSION_CODES.productRead },
    { id: 'goods-category', parentId: 'goods', name: 'goods-category', title: '分类管理', path: '/goods/categories', component: 'product/categories', type: 'menu', permission: PERMISSION_CODES.productRead },
    { id: 'goods-inventory', parentId: 'goods', name: 'goods-inventory', title: '库存管理', path: '/goods/inventory', component: 'product/inventory', type: 'menu', permission: PERMISSION_CODES.inventoryAdjust },
    { id: 'order', parentId: null, name: 'order', title: '订单中心', path: '/orders', type: 'catalog', icon: 'Tickets' },
    { id: 'order-list', parentId: 'order', name: 'order-list', title: '订单管理', path: '/orders/list', component: 'order/list', type: 'menu', permission: PERMISSION_CODES.orderRead },
    { id: 'system', parentId: null, name: 'system', title: '系统管理', path: '/system', type: 'catalog', icon: 'Setting' },
    { id: 'system-user', parentId: 'system', name: 'system-user', title: '用户管理', path: '/system/users', component: 'system/users', type: 'menu', permission: PERMISSION_CODES.systemUserManage },
    { id: 'system-role', parentId: 'system', name: 'system-role', title: '角色管理', path: '/system/roles', component: 'system/roles', type: 'menu', permission: PERMISSION_CODES.systemRoleManage },
    { id: 'system-menu', parentId: 'system', name: 'system-menu', title: '菜单管理', path: '/system/menus', component: 'system/menus', type: 'menu', permission: PERMISSION_CODES.systemMenuManage },
    { id: 'system-log', parentId: 'system', name: 'system-log', title: '操作日志', path: '/system/logs', component: 'system/logs', type: 'menu', permission: PERMISSION_CODES.systemLogRead }
  ]);

  readonly users: UserRecord[] = [
    { id: 'u-admin', username: 'admin', passwordHash: hashSync('Admin123!', 10), displayName: '系统管理员', email: 'admin@example.com', phone: '13800000001', department: '信息中心', roleIds: ['role-admin'] },
    { id: 'u-operator', username: 'operator', passwordHash: hashSync('Operator123!', 10), displayName: '运营专员', email: 'operator@example.com', phone: '13800000002', department: '商品运营部', roleIds: ['role-operator'] }
  ];

  readonly categories: CategoryDTO[] = [
    { id: 'cate-electronics', name: '数码电器', status: 'enabled', sort: 1 },
    { id: 'cate-office', name: '办公设备', status: 'enabled', sort: 2 }
  ];

  readonly products: ProductDTO[] = [
    { id: 'prod-001', name: '旗舰办公显示器', sku: 'MONITOR-001', categoryId: 'cate-electronics', categoryName: '数码电器', price: 2999, costPrice: 2150, stock: 42, sales: 123, status: 'active', cover: 'https://images.example.com/monitor.png', description: '面向企业采购场景的高刷新率显示器。', updatedAt: new Date().toISOString() },
    { id: 'prod-002', name: '人体工学办公椅', sku: 'CHAIR-002', categoryId: 'cate-office', categoryName: '办公设备', price: 1699, costPrice: 980, stock: 15, sales: 64, status: 'draft', cover: 'https://images.example.com/chair.png', description: '支持腰靠调节与多段锁定。', updatedAt: new Date().toISOString() }
  ];

  readonly orders: OrderDTO[] = [
    { id: 'order-001', orderNo: 'SO202603160001', customerName: '苏州总务部', amount: 5998, status: 'paid', createdAt: new Date().toISOString() },
    { id: 'order-002', orderNo: 'SO202603160002', customerName: '昆山采购组', amount: 1699, status: 'pending', createdAt: new Date().toISOString() }
  ];

  readonly inventoryRecords: InventoryRecordDTO[] = [
    { id: 'inv-001', productId: 'prod-001', productName: '旗舰办公显示器', change: 10, reason: '初始化入库', createdAt: new Date().toISOString(), operatorName: '系统管理员' }
  ];

  readonly operationLogs: OperationLogRecord[] = [];
  readonly sessions: SessionRecord[] = [];

  async findUserByUsername(username: string) {
    return this.users.find((item) => item.username === username);
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const user = this.users.find((item) => item.id === userId);
    if (!user) {
      return undefined;
    }
    const roles = this.roles.filter((role) => user.roleIds.includes(role.id));
    const menuIds = new Set(roles.flatMap((role) => role.menuIds));
    const flatMenus = this.flattenMenus(this.menus).filter((menu) => menu.type !== 'button' && menuIds.has(menu.id));
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      phone: user.phone,
      department: user.department,
      roleIds: user.roleIds,
      roles: roles.map((role) => role.name),
      permissions: roles.flatMap((role) => role.permissionCodes),
      menus: buildMenuTree(flatMenus)
    };
  }

  async listUsers() {
    return Promise.all(this.users.map((item) => this.getUserProfile(item.id))) as Promise<UserProfile[]>;
  }

  async listRoles() {
    return this.roles;
  }

  async listMenus() {
    return this.menus;
  }

  async listOperationLogs() {
    return [...this.operationLogs].reverse();
  }

  async createOperationLog(input: Omit<OperationLogRecord, 'id' | 'createdAt'>) {
    const record = { id: `log-${this.operationLogs.length + 1}`, createdAt: new Date().toISOString(), ...input };
    this.operationLogs.push(record);
    return record;
  }

  async saveSession(userId: string, accessToken: string, refreshToken: string) {
    this.sessions.push({ userId, accessToken, refreshToken, createdAt: new Date().toISOString() });
  }

  async resolveAccessToken(token: string) {
    return this.sessions.find((item) => item.accessToken === token)?.userId ?? null;
  }

  async resolveRefreshToken(token: string) {
    return this.sessions.find((item) => item.refreshToken === token)?.userId ?? null;
  }

  async revokeSession(refreshToken: string) {
    const session = this.sessions.find((item) => item.refreshToken === refreshToken);
    if (!session) {
      return;
    }
    const next = this.sessions.filter((item) => item.userId !== session.userId);
    this.sessions.splice(0, this.sessions.length, ...next);
  }

  async listProducts(filter: ProductFilter): Promise<PageResult<ProductDTO>> {
    const keyword = filter.keyword?.trim();
    const categoryId = filter.categoryId?.trim();
    const items = this.products.filter((item) => {
      const matchedKeyword = keyword ? item.name.includes(keyword) || item.sku.includes(keyword) : true;
      const matchedCategory = categoryId ? item.categoryId === categoryId : true;
      const matchedStatus = filter.status ? item.status === filter.status : true;
      return matchedKeyword && matchedCategory && matchedStatus;
    });
    const start = (filter.page - 1) * filter.pageSize;
    return { items: items.slice(start, start + filter.pageSize), total: items.length, page: filter.page, pageSize: filter.pageSize };
  }

  async getProductDetail(id: string) {
    const product = this.products.find((item) => item.id === id);
    return product ? { ...product } : undefined;
  }

  async createProduct(payload: ProductUpsertPayload) {
    const category = this.categories.find((item) => item.id === payload.categoryId);
    const created: ProductDTO = { id: `prod-${this.products.length + 1}`, name: payload.name, sku: payload.sku, categoryId: payload.categoryId, categoryName: category?.name ?? '未分类', price: payload.price, costPrice: payload.costPrice, stock: payload.stock, sales: 0, status: payload.status, cover: payload.cover, description: payload.description, updatedAt: new Date().toISOString() };
    this.products.unshift(created);
    return created;
  }

  async updateProduct(id: string, payload: ProductUpsertPayload) {
    const current = this.products.find((item) => item.id === id);
    if (!current) {
      throw new Error('商品不存在');
    }
    const category = this.categories.find((item) => item.id === payload.categoryId);
    Object.assign(current, { ...payload, categoryName: category?.name ?? '未分类', updatedAt: new Date().toISOString() });
    return current;
  }

  async deleteProduct(id: string) {
    const index = this.products.findIndex((item) => item.id === id);
    if (index >= 0) {
      this.products.splice(index, 1);
    }
  }

  async publishProduct(id: string, status: ProductDTO['status']) {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw new Error('商品不存在');
    }
    product.status = status;
    product.updatedAt = new Date().toISOString();
    return product;
  }

  async adjustInventory(payload: InventoryAdjustPayload) {
    const product = this.products.find((item) => item.id === payload.productId);
    if (!product) {
      throw new Error('商品不存在');
    }
    product.stock += payload.change;
    product.updatedAt = new Date().toISOString();
    this.inventoryRecords.push({ id: `inv-${this.inventoryRecords.length + 1}`, productId: product.id, productName: product.name, change: payload.change, reason: payload.reason, createdAt: new Date().toISOString(), operatorName: '系统管理员' });
    return product;
  }

  async listCategories() {
    return this.categories;
  }

  async listInventoryRecords() {
    return this.inventoryRecords;
  }

  async listOrders() {
    return this.orders;
  }

  private flattenMenus(nodes: MenuTreeNode[]): MenuTreeNode[] {
    return nodes.flatMap((node) => [{ ...node, children: undefined }, ...(node.children ? this.flattenMenus(node.children) : [])]);
  }
}
