import { describe, expect, it } from 'vitest';
import { AuthService } from '../src/auth/auth.service';
import { AuditService } from '../src/audit/audit.service';
import { InMemoryDataStore } from '../src/data/in-memory-data.store';
import { SessionStoreService } from '../src/auth/session-store.service';

describe('AuthService', () => {
  it('使用正确账号密码登录并返回用户信息与双 token', async () => {
    const store = new InMemoryDataStore();
    const auditService = new AuditService(store);
    const sessionStore = new SessionStoreService(store);
    const service = new AuthService(store, auditService, sessionStore);

    const result = await service.login({ username: 'admin', password: 'Admin123!' }, '127.0.0.1');
    const logs = await store.listOperationLogs();

    expect(result.user.username).toBe('admin');
    expect(result.accessToken).toContain('access');
    expect(result.refreshToken).toContain('refresh');
    expect(logs[0]?.action).toBe('auth.login');
  });

  it('使用错误密码登录时抛出异常', async () => {
    const store = new InMemoryDataStore();
    const auditService = new AuditService(store);
    const sessionStore = new SessionStoreService(store);
    const service = new AuthService(store, auditService, sessionStore);

    await expect(service.login({ username: 'admin', password: 'wrong-password' }, '127.0.0.1')).rejects.toThrow('用户名或密码错误');
  });

  it('退出登录后刷新 token 失效', async () => {
    const store = new InMemoryDataStore();
    const auditService = new AuditService(store);
    const sessionStore = new SessionStoreService(store);
    const service = new AuthService(store, auditService, sessionStore);

    const loginResult = await service.login({ username: 'admin', password: 'Admin123!' }, '127.0.0.1');
    await service.logout(loginResult.refreshToken, loginResult.user.id);

    await expect(service.refresh(loginResult.refreshToken)).rejects.toThrow('刷新令牌已失效');
  });
});
