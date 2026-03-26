import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardPage } from '../views/dashboard/dashboard-page';

vi.mock('../api/system', () => ({
  fetchDashboardSummary: vi.fn().mockResolvedValue({
    productCount: 128,
    activeProductCount: 94,
    orderCount: 61,
    paidOrderAmount: 328000,
    inventoryAlertCount: 6,
    latestLogs: [
      {
        id: 'log-1',
        action: 'product.publish',
        detail: '企业网关完成上架',
        operatorName: '系统管理员',
        createdAt: '2026-03-26 11:00:00'
      }
    ]
  }),
  fetchUsers: vi.fn(),
  fetchRoles: vi.fn(),
  fetchMenus: vi.fn(),
  fetchLogs: vi.fn(),
  fetchSettings: vi.fn()
}));

function renderDashboardPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  return render(
    <ConfigProvider locale={zhCN}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <DashboardPage />
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}

describe('DashboardPage', () => {
  it('renders the cockpit hero and activity structure', async () => {
    renderDashboardPage();

    expect(await screen.findByTestId('dashboard-hero')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-kpi-grid')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-activity-panel')).toBeInTheDocument();
  });
});
