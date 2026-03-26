import 'reflect-metadata';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Test, type TestingModule } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PERMISSION_CODES, type ProductUpsertPayload } from '@enterprise/shared';
import { AppModule } from '../src/app.module';
import { DATA_STORE, type DataStore } from '../src/data/contracts/data-store';

const ORIGINAL_DATA_STORE_DRIVER = process.env.DATA_STORE_DRIVER;
const ORIGINAL_MONGODB_URL = process.env.MONGODB_URL;
const ORIGINAL_MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

describe('MongoDataStore', () => {
  let mongoServer: MongoMemoryServer;
  let client: MongoClient;
  let moduleRef: TestingModule;
  let store: DataStore;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    client = new MongoClient(mongoServer.getUri());
    await client.connect();

    const dbName = 'enterprise_goods_admin_test';
    const db = client.db(dbName);

    await db.collection('users').insertOne({
      id: 'u-admin',
      username: 'admin',
      passwordHash: '$2a$10$h1mqg4PKS4xY8M7Q8hVjNOo2LUxP4zQ9o7XW9A1dM7xM7zB9e6fJ2',
      displayName: '系统管理员',
      email: 'admin@example.com',
      phone: '13800000001',
      department: '信息中心',
      status: 'enabled',
      roleIds: ['role-admin'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await db.collection('roles').insertOne({
      id: 'role-admin',
      name: '系统管理员',
      permissionCodes: [PERMISSION_CODES.productRead, PERMISSION_CODES.productWrite, PERMISSION_CODES.inventoryAdjust],
      menuIds: ['dashboard', 'goods', 'goods-list'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await db.collection('menus').insertMany([
      {
        id: 'dashboard',
        parentId: null,
        name: 'dashboard',
        title: '仪表盘',
        path: '/dashboard',
        component: 'dashboard/index',
        permission: null,
        type: 'catalog',
        icon: 'House',
        hidden: false,
        sort: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'goods',
        parentId: null,
        name: 'goods',
        title: '商品中心',
        path: '/goods',
        component: null,
        permission: null,
        type: 'catalog',
        icon: 'Goods',
        hidden: false,
        sort: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'goods-list',
        parentId: 'goods',
        name: 'goods-list',
        title: '商品管理',
        path: '/goods/products',
        component: 'product/list',
        permission: PERMISSION_CODES.productRead,
        type: 'menu',
        icon: null,
        hidden: false,
        sort: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await db.collection('productCategories').insertOne({
      id: 'cate-electronics',
      name: '数码电器',
      status: 'enabled',
      sort: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    process.env.DATA_STORE_DRIVER = 'mongo';
    process.env.MONGODB_URL = mongoServer.getUri();
    process.env.MONGODB_DB_NAME = dbName;

    moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    store = moduleRef.get<DataStore>(DATA_STORE);
  }, 180000);

  afterAll(async () => {
    await moduleRef?.close();
    await client?.close();
    await mongoServer?.stop();

    if (ORIGINAL_DATA_STORE_DRIVER === undefined) {
      delete process.env.DATA_STORE_DRIVER;
    } else {
      process.env.DATA_STORE_DRIVER = ORIGINAL_DATA_STORE_DRIVER;
    }

    if (ORIGINAL_MONGODB_URL === undefined) {
      delete process.env.MONGODB_URL;
    } else {
      process.env.MONGODB_URL = ORIGINAL_MONGODB_URL;
    }

    if (ORIGINAL_MONGODB_DB_NAME === undefined) {
      delete process.env.MONGODB_DB_NAME;
    } else {
      process.env.MONGODB_DB_NAME = ORIGINAL_MONGODB_DB_NAME;
    }
  }, 180000);

  it('从 MongoDB 读取管理员资料与菜单权限', async () => {
    const profile = await store.getUserProfile?.call(store, 'u-admin');

    expect(profile?.username).toBe('admin');
    expect(profile?.permissions).toContain(PERMISSION_CODES.productRead);
    expect(profile?.menus.length).toBeGreaterThan(0);
  });

  it('将商品与库存流水写入 MongoDB', async () => {
    const payload: ProductUpsertPayload = {
      name: 'Mongo 商品',
      sku: `MONGO-${Date.now()}`,
      categoryId: 'cate-electronics',
      price: 2999,
      costPrice: 1999,
      stock: 8,
      status: 'draft',
      cover: 'https://example.com/mongo-product.png',
      description: '用于验证 MongoDataStore 持久化'
    };

    const created = await store.createProduct?.call(store, payload, 'u-admin', '系统管理员');
    await store.adjustInventory?.call(store, { productId: created?.id ?? 'missing-product-id', change: 3, reason: '测试补货' }, 'u-admin', '系统管理员');
    const detail = await store.getProductDetail?.call(store, created?.id ?? 'missing-product-id');
    const records = await store.listInventoryRecords?.call(store);

    expect(detail?.stock).toBe(11);
    expect(records?.some((item) => item.productId === created?.id && item.change === 3)).toBe(true);
  });
});
