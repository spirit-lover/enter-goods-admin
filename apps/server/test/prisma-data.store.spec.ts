import { beforeAll, describe, expect, it } from 'vitest';
import type { ProductUpsertPayload } from '@enterprise/shared';
import { PrismaDataStore } from '../src/data/prisma-data.store';

process.env.DATABASE_URL = 'mysql://root:123456@localhost:3306/enterprise_goods_admin';

describe('PrismaDataStore', () => {
  let store: PrismaDataStore;

  beforeAll(async () => {
    store = new PrismaDataStore();
    await store.$connect();
  });

  it('从数据库读取管理员资料与菜单权限', async () => {
    const profile = await store.getUserProfile('u-admin');

    expect(profile?.username).toBe('admin');
    expect(profile?.permissions.length).toBeGreaterThan(3);
    expect(profile?.menus.length).toBeGreaterThan(0);
  });

  it('将商品与库存流水写入数据库', async () => {
    const sku = `AUTO-${Date.now()}`;
    const payload: ProductUpsertPayload = {
      name: '数据库落库测试商品',
      sku,
      categoryId: 'cate-electronics',
      price: 2999,
      costPrice: 1999,
      stock: 8,
      status: 'draft',
      cover: 'https://example.com/db-test.png',
      description: '用于验证 Prisma 持久化'
    };

    const created = await store.createProduct(payload);
    await store.adjustInventory({ productId: created.id, change: 3, reason: '测试补货' }, 'u-admin', '系统管理员');
    const detail = await store.getProductDetail(created.id);
    const records = await store.listInventoryRecords();

    expect(detail?.stock).toBe(11);
    expect(records.some((item) => item.productId === created.id && item.change === 3)).toBe(true);
  });
});
