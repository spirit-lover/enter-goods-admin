import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from '../views/login/login-page';
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

function renderLoginPage() {
  const authStore = createAuthStore();
  const permissionStore = createPermissionStore();

  return render(
    <ConfigProvider locale={zhCN}>
      <AntApp>
        <StoreProviders authStore={authStore} permissionStore={permissionStore}>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </StoreProviders>
      </AntApp>
    </ConfigProvider>
  );
}

describe('LoginPage', () => {
  it('renders the brand hero and default account hint', () => {
    renderLoginPage();

    expect(screen.getByTestId('login-hero')).toBeInTheDocument();
    expect(screen.getByTestId('login-capabilities')).toBeInTheDocument();
    expect(screen.getByText(/admin \/ Admin123!/i)).toBeInTheDocument();
  });
});
