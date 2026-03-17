import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { PERMISSION_CODES } from '@enterprise/shared';

const prisma = new PrismaClient();

const menus = [
  { id: 'dashboard', parentId: null, name: 'dashboard', title: '仪表盘', path: '/dashboard', component: 'dashboard/index', permission: null, type: 'catalog', icon: 'House', hidden: false, sort: 1 },
  { id: 'goods', parentId: null, name: 'goods', title: '商品中心', path: '/goods', component: null, permission: null, type: 'catalog', icon: 'Goods', hidden: false, sort: 2 },
  { id: 'goods-list', parentId: 'goods', name: 'goods-list', title: '商品管理', path: '/goods/products', component: 'product/list', permission: PERMISSION_CODES.productRead, type: 'menu', icon: null, hidden: false, sort: 21 },
  { id: 'goods-category', parentId: 'goods', name: 'goods-category', title: '分类管理', path: '/goods/categories', component: 'product/categories', permission: PERMISSION_CODES.productRead, type: 'menu', icon: null, hidden: false, sort: 22 },
  { id: 'goods-inventory', parentId: 'goods', name: 'goods-inventory', title: '库存管理', path: '/goods/inventory', component: 'product/inventory', permission: PERMISSION_CODES.inventoryAdjust, type: 'menu', icon: null, hidden: false, sort: 23 },
  { id: 'order', parentId: null, name: 'order', title: '订单中心', path: '/orders', component: null, permission: null, type: 'catalog', icon: 'Tickets', hidden: false, sort: 3 },
  { id: 'order-list', parentId: 'order', name: 'order-list', title: '订单管理', path: '/orders/list', component: 'order/list', permission: PERMISSION_CODES.orderRead, type: 'menu', icon: null, hidden: false, sort: 31 },
  { id: 'system', parentId: null, name: 'system', title: '系统管理', path: '/system', component: null, permission: null, type: 'catalog', icon: 'Setting', hidden: false, sort: 4 },
  { id: 'system-user', parentId: 'system', name: 'system-user', title: '用户管理', path: '/system/users', component: 'system/users', permission: PERMISSION_CODES.systemUserManage, type: 'menu', icon: null, hidden: false, sort: 41 },
  { id: 'system-role', parentId: 'system', name: 'system-role', title: '角色管理', path: '/system/roles', component: 'system/roles', permission: PERMISSION_CODES.systemRoleManage, type: 'menu', icon: null, hidden: false, sort: 42 },
  { id: 'system-menu', parentId: 'system', name: 'system-menu', title: '菜单管理', path: '/system/menus', component: 'system/menus', permission: PERMISSION_CODES.systemMenuManage, type: 'menu', icon: null, hidden: false, sort: 43 },
  { id: 'system-log', parentId: 'system', name: 'system-log', title: '操作日志', path: '/system/logs', component: 'system/logs', permission: PERMISSION_CODES.systemLogRead, type: 'menu', icon: null, hidden: false, sort: 44 }
];

async function main() {
  await prisma.session.deleteMany();
  await prisma.operationLog.deleteMany();
  await prisma.inventoryRecord.deleteMany();
  await prisma.product.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.menu.deleteMany();

  for (const menu of menus) {
    await prisma.menu.create({ data: menu });
  }

  await prisma.role.createMany({ data: [
    { id: 'role-admin', name: '系统管理员', permissionCodes: Object.values(PERMISSION_CODES), menuIds: menus.map((item) => item.id) },
    { id: 'role-operator', name: '运营专员', permissionCodes: [PERMISSION_CODES.dashboardView, PERMISSION_CODES.productRead, PERMISSION_CODES.productPublish, PERMISSION_CODES.orderRead], menuIds: ['dashboard', 'goods', 'goods-list', 'order', 'order-list'] }
  ] });

  await prisma.user.createMany({ data: [
    { id: 'u-admin', username: 'admin', passwordHash: hashSync('Admin123!', 10), displayName: '系统管理员', email: 'admin@example.com', phone: '13800000001', department: '信息中心', status: 'enabled', roleIds: ['role-admin'] },
    { id: 'u-operator', username: 'operator', passwordHash: hashSync('Operator123!', 10), displayName: '运营专员', email: 'operator@example.com', phone: '13800000002', department: '商品运营部', status: 'enabled', roleIds: ['role-operator'] }
  ] });

  await prisma.productCategory.createMany({ data: [
    { id: 'cate-electronics', name: '数码电器', status: 'enabled', sort: 1 },
    { id: 'cate-office', name: '办公设备', status: 'enabled', sort: 2 }
  ] });

  await prisma.product.createMany({ data: [
    { id: 'prod-001', name: '旗舰办公显示器', sku: 'MONITOR-001', categoryId: 'cate-electronics', price: 2999, costPrice: 2150, stock: 42, sales: 123, status: 'active', cover: 'https://images.example.com/monitor.png', description: '面向企业采购场景的高刷新率显示器。', createdBy: 'u-admin', updatedBy: 'u-admin' },
    { id: 'prod-002', name: '人体工学办公椅', sku: 'CHAIR-002', categoryId: 'cate-office', price: 1699, costPrice: 980, stock: 15, sales: 64, status: 'draft', cover: 'https://images.example.com/chair.png', description: '支持腰靠调节与多段锁定。', createdBy: 'u-admin', updatedBy: 'u-admin' }
  ] });

  await prisma.inventoryRecord.create({ data: { productId: 'prod-001', change: 10, reason: '初始化入库', operatorName: '系统管理员' } });

  await prisma.order.createMany({ data: [
    { id: 'order-001', orderNo: 'SO202603160001', customerName: '苏州总务部', amount: 5998, status: 'paid' },
    { id: 'order-002', orderNo: 'SO202603160002', customerName: '昆山采购组', amount: 1699, status: 'pending' }
  ] });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
