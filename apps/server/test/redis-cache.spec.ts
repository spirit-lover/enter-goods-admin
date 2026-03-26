import { afterEach, describe, expect, it } from 'vitest';
import { DashboardService } from '../src/dashboard/dashboard.service';
import { PermissionService } from '../src/permission/permission.service';

const ORIGINAL_CACHE_DRIVER = process.env.CACHE_DRIVER;

class FakeRedisClientService {
  values = new Map<string, string>();

  async getJson<T>(key: string): Promise<T | null> {
    const raw = this.values.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async setJson(key: string, value: unknown): Promise<void> {
    this.values.set(key, JSON.stringify(value));
  }
}

describe('Redis cache services', () => {
  afterEach(() => {
    if (ORIGINAL_CACHE_DRIVER === undefined) {
      delete process.env.CACHE_DRIVER;
    } else {
      process.env.CACHE_DRIVER = ORIGINAL_CACHE_DRIVER;
    }
  });

  it('DashboardService 命中 Redis 缓存后不再重复查库', async () => {
    process.env.CACHE_DRIVER = 'redis';
    let listProductsCalls = 0;
    let listOrdersCalls = 0;
    let listLogsCalls = 0;
    const store = {
      async listProducts() {
        listProductsCalls += 1;
        return { items: [{ status: 'active', stock: 12 }], total: 1, page: 1, pageSize: 1000 };
      },
      async listOrders() {
        listOrdersCalls += 1;
        return [{ amount: 88, status: 'paid' }];
      },
      async listOperationLogs() {
        listLogsCalls += 1;
        return [{ id: 'log-1', action: 'x', module: 'x', operatorId: 'u', operatorName: 'n', detail: 'd', ip: '127.0.0.1', createdAt: new Date().toISOString() }];
      }
    };
    const redis = new FakeRedisClientService();
    const service = new (DashboardService as any)(store, redis) as DashboardService;

    await service.summary();
    await service.summary();

    expect(listProductsCalls).toBe(1);
    expect(listOrdersCalls).toBe(1);
    expect(listLogsCalls).toBe(1);
  });

  it('PermissionService 命中 Redis 缓存后不再重复查库', async () => {
    process.env.CACHE_DRIVER = 'redis';
    let profileCalls = 0;
    const store = {
      async getUserProfile() {
        profileCalls += 1;
        return {
          id: 'u-admin',
          username: 'admin',
          displayName: '系统管理员',
          email: 'admin@example.com',
          phone: '13800000001',
          department: '信息中心',
          roleIds: ['role-admin'],
          roles: ['系统管理员'],
          permissions: ['product:read'],
          menus: [{ id: 'dashboard', parentId: null, name: 'dashboard', title: '仪表盘', path: '/dashboard', type: 'catalog', hidden: false }]
        };
      }
    };
    const redis = new FakeRedisClientService();
    const service = new (PermissionService as any)(store, redis) as PermissionService;

    await service.getMenus('u-admin');
    await service.getMenus('u-admin');
    await service.getCodes('u-admin');
    await service.getCodes('u-admin');

    expect(profileCalls).toBe(1);
  });
});
