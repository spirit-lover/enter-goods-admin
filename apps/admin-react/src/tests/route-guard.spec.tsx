import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppRouter } from '../routes/app-router';
import { createAuthStore } from '../stores/auth-store';
import { createPermissionStore } from '../stores/permission-store';
import { StoreProviders } from '../stores/store-provider';

vi.mock('../api/auth', () => ({
  fetchCodes: vi.fn(),
  fetchMenus: vi.fn(),
  fetchProfile: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn()
}));

vi.mock('../api/product', () => ({
  fetchProducts: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 10 }),
  fetchCategories: vi.fn().mockResolvedValue([]),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  publishProduct: vi.fn(),
  deleteProduct: vi.fn(),
  adjustInventory: vi.fn(),
  fetchInventoryRecords: vi.fn().mockResolvedValue([]),
  fetchOrders: vi.fn().mockResolvedValue([])
}));

vi.mock('../api/system', () => ({
  fetchDashboardSummary: vi.fn().mockResolvedValue({
    productCount: 0,
    activeProductCount: 0,
    orderCount: 0,
    paidOrderAmount: 0,
    inventoryAlertCount: 0,
    latestLogs: []
  }),
  fetchUsers: vi.fn().mockResolvedValue([]),
  fetchRoles: vi.fn().mockResolvedValue([]),
  fetchMenus: vi.fn().mockResolvedValue([]),
  fetchLogs: vi.fn().mockResolvedValue([]),
  fetchSettings: vi.fn().mockResolvedValue({})
}));

function renderRouter(path: string, permissionCodes: string[] = []) {
  const authStore = createAuthStore();
  const permissionStore = createPermissionStore();

  authStore.setState({
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    user: {
      id: 'user-admin',
      username: 'admin',
      displayName: '系统管理员',
      email: 'admin@example.com',
      phone: '13800000000',
      department: '平台研发',
      roleIds: ['role-admin'],
      roles: ['超级管理员'],
      permissions: permissionCodes as never[],
      menus: []
    }
  });
  permissionStore.setState({
    permissions: permissionCodes as never[],
    menus: []
  });

  return render(
    <StoreProviders authStore={authStore} permissionStore={permissionStore}>
      <AppRouter initialEntries={[path]} />
    </StoreProviders>
  );
}

describe('route guard', () => {
  it('未授权页面回退到 dashboard', async () => {
    renderRouter('/goods/products', []);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-hero')).toBeInTheDocument();
    });
  });
});
