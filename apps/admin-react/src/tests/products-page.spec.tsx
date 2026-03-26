import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PERMISSION_CODES, type PageResult, type ProductDTO } from '@enterprise/shared';
import { describe, expect, it, vi } from 'vitest';
import { createAuthStore } from '../stores/auth-store';
import { createPermissionStore } from '../stores/permission-store';
import { StoreProviders } from '../stores/store-provider';
import { ProductsPage } from '../views/products/products-page';

vi.mock('../api/product', () => ({
  fetchProducts: vi.fn(),
  fetchCategories: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  publishProduct: vi.fn(),
  deleteProduct: vi.fn(),
  adjustInventory: vi.fn(),
  fetchInventoryRecords: vi.fn(),
  fetchOrders: vi.fn()
}));

function renderProductsPage(permissions: string[]) {
  const authStore = createAuthStore();
  const permissionStore = createPermissionStore();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

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
      permissions: permissions as never[],
      menus: []
    }
  });
  permissionStore.setState({
    menus: [],
    permissions: permissions as never[]
  });

  return render(
    <ConfigProvider locale={zhCN}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <StoreProviders authStore={authStore} permissionStore={permissionStore}>
            <ProductsPage />
          </StoreProviders>
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}

describe('ProductsPage', () => {
  it('支持筛选、上架和删除商品', async () => {
    const productApi = await import('../api/product');
    const user = userEvent.setup();

    vi.mocked(productApi.fetchCategories).mockResolvedValue([
      { id: 'cate-electronics', name: '数码电器', status: 'enabled', sort: 1 }
    ]);
    const listResult: PageResult<ProductDTO> = {
      items: [
        {
          id: 'product-gateway',
          name: '企业网关',
          sku: 'GW-001',
          categoryId: 'cate-electronics',
          categoryName: '数码电器',
          price: 1999,
          costPrice: 1200,
          stock: 18,
          sales: 8,
          status: 'draft',
          cover: 'https://images.example.com/default.png',
          description: '网络设备新品',
          updatedAt: '2026-03-26 10:00:00'
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10
    };

    vi.mocked(productApi.fetchProducts)
      .mockResolvedValueOnce(listResult)
      .mockResolvedValue(listResult);
    vi.mocked(productApi.publishProduct).mockResolvedValue({} as never);
    vi.mocked(productApi.deleteProduct).mockResolvedValue(null);

    renderProductsPage([
      PERMISSION_CODES.productRead,
      PERMISSION_CODES.productWrite,
      PERMISSION_CODES.productPublish
    ]);

    expect(await screen.findByText('企业网关')).toBeInTheDocument();
    expect(screen.getByTestId('products-overview')).toBeInTheDocument();
    expect(screen.getByTestId('products-toolbar')).toBeInTheDocument();
    expect(vi.mocked(productApi.fetchProducts).mock.calls[0][0]).toMatchObject({
      keyword: '',
      page: 1,
      pageSize: 10
    });

    await user.type(screen.getByPlaceholderText('搜索商品名或 SKU'), '网关');
    await user.click(screen.getByRole('button', { name: /查\s*询/ }));

    await waitFor(() => {
      const calls = vi.mocked(productApi.fetchProducts).mock.calls;
      expect(calls[calls.length - 1]?.[0]).toMatchObject({
        keyword: '网关'
      });
    });

    await user.click(screen.getByRole('button', { name: '上架' }));
    await waitFor(() => {
      expect(productApi.publishProduct).toHaveBeenCalledWith('product-gateway', 'active');
    });

    await user.click(screen.getByRole('button', { name: '删除' }));
    await user.click(await screen.findByRole('button', { name: /确\s*认/ }));
    await waitFor(() => {
      expect(productApi.deleteProduct).toHaveBeenCalledWith('product-gateway', expect.anything());
    });
  }, 15000);

  it('无写权限时隐藏新增和操作按钮', async () => {
    const productApi = await import('../api/product');
    vi.mocked(productApi.fetchCategories).mockResolvedValue([]);
    vi.mocked(productApi.fetchProducts).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10
    });

    renderProductsPage([PERMISSION_CODES.productRead]);

    expect(await screen.findByText('商品管理')).toBeInTheDocument();
    expect(screen.getByTestId('products-overview')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '新增商品' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '上架' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '删除' })).not.toBeInTheDocument();
  });
});
