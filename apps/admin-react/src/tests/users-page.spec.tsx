import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UsersPage } from '../views/system/users-page';

vi.mock('../api/system', () => ({
  fetchUsers: vi.fn(),
  fetchRoles: vi.fn(),
  fetchMenus: vi.fn(),
  fetchLogs: vi.fn(),
  fetchSettings: vi.fn()
}));

function renderUsersPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  return render(
    <ConfigProvider locale={zhCN}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <UsersPage />
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}

describe('UsersPage', () => {
  it('展示治理摘要与用户表格', async () => {
    const systemApi = await import('../api/system');

    vi.mocked(systemApi.fetchUsers).mockResolvedValue([
      {
        id: 'user-admin',
        username: 'admin',
        displayName: '系统管理员',
        email: 'admin@example.com',
        phone: '13800000000',
        department: '平台研发',
        roleIds: ['role-admin'],
        roles: ['超级管理员', '商品运营'],
        permissions: [],
        menus: []
      },
      {
        id: 'user-auditor',
        username: 'auditor',
        displayName: '审计专员',
        email: 'auditor@example.com',
        phone: '13800000001',
        department: '风险治理',
        roleIds: ['role-auditor'],
        roles: ['审计员'],
        permissions: [],
        menus: []
      }
    ]);

    renderUsersPage();

    expect(await screen.findByText('系统管理员')).toBeInTheDocument();
    expect(screen.getByTestId('users-overview')).toBeInTheDocument();
    expect(screen.getByTestId('users-table-panel')).toBeInTheDocument();
  });
});
