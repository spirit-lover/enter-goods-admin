import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LoginResult } from '@enterprise/shared';
import { createAuthStore } from '../stores/auth-store';

vi.mock('../api/auth', () => ({
  login: vi.fn(),
  logout: vi.fn()
}));

describe('auth store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('登录后持久化 token，退出后清空会话', async () => {
    const authApi = await import('../api/auth');
    const result: LoginResult = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 7200,
      user: {
        id: 'user-admin',
        username: 'admin',
        displayName: '系统管理员',
        email: 'admin@example.com',
        phone: '13800000000',
        department: '平台研发',
        roleIds: ['role-admin'],
        roles: ['超级管理员'],
        permissions: [],
        menus: []
      }
    };

    vi.mocked(authApi.login).mockResolvedValue(result);
    vi.mocked(authApi.logout).mockResolvedValue(null);

    const store = createAuthStore();

    await store.getState().login({ username: 'admin', password: 'Admin123!' });

    expect(store.getState().accessToken).toBe('access-token');
    expect(window.localStorage.getItem('enterprise_access_token')).toBe('access-token');
    expect(window.localStorage.getItem('enterprise_refresh_token')).toBe('refresh-token');

    await store.getState().logout();

    expect(store.getState().accessToken).toBe('');
    expect(store.getState().user).toBeNull();
    expect(window.localStorage.getItem('enterprise_access_token')).toBeNull();
    expect(window.localStorage.getItem('enterprise_refresh_token')).toBeNull();
  });

  it('登录失败时不写入本地会话', async () => {
    const authApi = await import('../api/auth');
    vi.mocked(authApi.login).mockRejectedValue(new Error('invalid credentials'));

    const store = createAuthStore();

    await expect(
      store.getState().login({ username: 'admin', password: 'wrong-password' })
    ).rejects.toThrow('invalid credentials');

    expect(store.getState().accessToken).toBe('');
    expect(window.localStorage.getItem('enterprise_access_token')).toBeNull();
    expect(window.localStorage.getItem('enterprise_refresh_token')).toBeNull();
  });
});
