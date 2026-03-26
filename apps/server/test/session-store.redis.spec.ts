import { afterEach, describe, expect, it } from 'vitest';
import { SessionStoreService } from '../src/auth/session-store.service';

const ORIGINAL_SESSION_DRIVER = process.env.SESSION_DRIVER;

class FakeDataStore {
  saveCalls = 0;
  accessResolveCalls = 0;
  refreshResolveCalls = 0;
  revokeCalls = 0;

  async saveSession(): Promise<void> {
    this.saveCalls += 1;
  }

  async resolveAccessToken(): Promise<string | null> {
    this.accessResolveCalls += 1;
    return null;
  }

  async resolveRefreshToken(): Promise<string | null> {
    this.refreshResolveCalls += 1;
    return null;
  }

  async revokeSession(): Promise<void> {
    this.revokeCalls += 1;
  }
}

class FakeRedisClientService {
  values = new Map<string, string>();
  sets = new Map<string, Set<string>>();

  async getValue(key: string): Promise<string | null> {
    return this.values.get(key) ?? null;
  }

  async setValue(key: string, value: string): Promise<void> {
    this.values.set(key, value);
  }

  async deleteKeys(keys: string[]): Promise<void> {
    for (const key of keys) {
      this.values.delete(key);
    }
  }

  async addSetMembers(key: string, members: string[]): Promise<void> {
    const current = this.sets.get(key) ?? new Set<string>();
    members.forEach((member) => current.add(member));
    this.sets.set(key, current);
  }

  async getSetMembers(key: string): Promise<string[]> {
    return [...(this.sets.get(key) ?? new Set<string>())];
  }

  async deleteKey(key: string): Promise<void> {
    this.values.delete(key);
    this.sets.delete(key);
  }
}

describe('SessionStoreService Redis', () => {
  afterEach(() => {
    if (ORIGINAL_SESSION_DRIVER === undefined) {
      delete process.env.SESSION_DRIVER;
    } else {
      process.env.SESSION_DRIVER = ORIGINAL_SESSION_DRIVER;
    }
  });

  it('当 SESSION_DRIVER=redis 时使用 Redis 保存并解析会话', async () => {
    process.env.SESSION_DRIVER = 'redis';
    const store = new FakeDataStore();
    const redis = new FakeRedisClientService();
    const service = new (SessionStoreService as any)(store, redis) as SessionStoreService;

    await service.save('u-admin', 'access.token', 'refresh.token');
    const resolvedAccessUserId = await service.resolveAccessToken('access.token');
    const resolvedRefreshUserId = await service.resolveRefreshToken('refresh.token');

    expect(resolvedAccessUserId).toBe('u-admin');
    expect(resolvedRefreshUserId).toBe('u-admin');
    expect(store.saveCalls).toBe(0);
    expect(store.accessResolveCalls).toBe(0);
    expect(store.refreshResolveCalls).toBe(0);
  });

  it('当 SESSION_DRIVER=redis 时撤销 refresh token 会让同用户 token 一起失效', async () => {
    process.env.SESSION_DRIVER = 'redis';
    const store = new FakeDataStore();
    const redis = new FakeRedisClientService();
    const service = new (SessionStoreService as any)(store, redis) as SessionStoreService;

    await service.save('u-admin', 'access.token', 'refresh.token');
    await service.revoke('refresh.token');

    await expect(service.resolveAccessToken('access.token')).rejects.toThrow('登录状态已失效');
    await expect(service.resolveRefreshToken('refresh.token')).rejects.toThrow('刷新令牌已失效');
    expect(store.revokeCalls).toBe(0);
  });
});
